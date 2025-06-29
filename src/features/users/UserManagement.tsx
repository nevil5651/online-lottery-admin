import { useState, useMemo } from 'react';
import { 
  Box, Dialog, Drawer,  
  MenuItem, Paper,   
   Avatar, Badge, Tabs, Tab, useTheme,
  DialogContentText, Chip,
  Grid
} from '@mui/material';
import { 
  DialogContent,
  CustomSnackbar as Snackbar,
  DialogActions,
  StatusChip, 
   DialogTitle,
   TextField ,
   Typography,Button} from '../../components/ui';
import { IconButton } from '@mui/material';

import { 
  Add, Block, Delete, Edit, 
  LockReset, Mail, Refresh, Save, Visibility, Close, Search
} from '@mui/icons-material';
import { 
  DataGrid, type GridColDef, type GridRowId, 
  GridToolbarContainer, GridToolbarFilterButton, 
  GridToolbarExport, GridToolbarDensitySelector, type GridRowParams
} from '@mui/x-data-grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { usePermissions } from './UserPermission';
import { userService } from './UserService';
import type { User, UserStatus, UserRole, ListUsersParams } from './UserTypes';

const UserManagement = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  
  // State management
  const [params, setParams] = useState<ListUsersParams>({
    page: 0,
    pageSize: 20,
    status: 'all',
    role: 'all',
    search: ''
  });
  
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [banModal, setBanModal] = useState<{ open: boolean; user: User | null }>({ 
    open: false, user: null 
  });
  const [resetModal, setResetModal] = useState<{ open: boolean; user: User | null }>({ 
    open: false, user: null 
  });
  const [snackbar, setSnackbar] = useState<{ 
    open: boolean; 
    message: string; 
    severity: 'success' | 'error'; 
  }>({ 
    open: false, message: '', severity: 'success' 
  });

  // Data fetching
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.fetchUsers(params),
    placeholderData: (prev) => prev,
    staleTime: 30000
  });

  // Optimize search with debounce
  const handleSearchChange = useMemo(() => debounce((search: string) => {
    setParams(prev => ({ ...prev, search, page: 0 }));
  }, 300), []);

  // Handle row selection
  const handleSelectionChange = (rowSelectionModel: GridRowId[]) => {
    setSelectedId(rowSelectionModel.length > 0 ? rowSelectionModel[0] : null);
  };

  // Handle row click for detail view
  const handleRowClick = (params: GridRowParams) => {
    if (can('read', 'user')) {
      setDetailUser(params.row as User);
      setDetailOpen(true);
      setEditMode(false);
    }
  };

  // Mutations
  const { mutate: updateUser } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['user', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to update user',
        severity: 'error'
      });
    }
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: UserStatus; reason?: string }) => 
      userService.changeStatus(id, status, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      setSnackbar({
        open: true,
        message: `User status updated to ${variables.status}`,
        severity: 'success'
      });
    }
  });

  const { mutate: resetPassword } = useMutation({
    mutationFn: ({ id, method }: { id: string; method: 'email' | 'temporary' }) => 
      userService.resetPassword(id, method),
    onSuccess: (_, variables) => {
      setSnackbar({
        open: true,
        message: `Password reset ${variables.method === 'email' ? 'email sent' : 'completed'}`,
        severity: 'success'
      });
    }
  });

  // Batch actions
  const handleBatchAction = (action: string) => {
    setSnackbar({
      open: true,
      message: `${selectedId ? (Array.isArray(selectedId) ? selectedId.length : 1) : 0} users ${action}`,
      severity: 'success'
    });
    setSelectedId(null);
  };

  // Responsive columns configuration
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: params.row.status === 'active' 
                  ? theme.palette.success.main 
                  : theme.palette.error.main,
                border: `2px solid ${theme.palette.background.paper}`
              }} />
            }
          >
            <Avatar 
              src={params.row.avatarUrl}
              sx={{ width: 36, height: 36, mr: 1 }}
            >
              {params.row.name.charAt(0)}
            </Avatar>
          </Badge>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {params.row.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => <StatusChip status={params.value} />
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.slice(0, 1).map((role: UserRole) => (
            <Chip 
              key={role} 
              label={role} 
              size="small" 
              variant="outlined"
              sx={{ 
                textTransform: 'capitalize',
                maxWidth: 100,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} 
            />
          ))}
          {params.value.length > 1 && (
            <Chip 
              label={`+${params.value.length - 1}`} 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box>
          {can('read', 'user') && (
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDetailUser(params.row as User);
                setDetailOpen(true);
                setEditMode(false);
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          )}
          {can('update', 'user') && (
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDetailUser(params.row as User);
                setDetailOpen(true);
                setEditMode(true);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
        </Box>
      )
    }
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ p: 1, gap: 1, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <GridToolbarFilterButton size="small" />
        <GridToolbarDensitySelector size="small" />
        <GridToolbarExport size="small" />
      </Box>
      
      {selectedId !== null && (
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {can('update_status', 'user') && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Block />}
              onClick={() => handleBatchAction('suspend')}
              color="error"
            >
              Suspend
            </Button>
          )}
          {can('reset_password', 'user') && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<LockReset />}
              onClick={() => handleBatchAction('reset_password')}
            >
              Reset
            </Button>
          )}
          {can('delete', 'user') && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Delete />}
              onClick={() => handleBatchAction('delete')}
              color="error"
            >
              Delete
            </Button>
          )}
        </Box>
      )}
    </GridToolbarContainer>
  );

  const UserDetailTabs = ({ user }: { user: User }) => {
    const [tabValue, setTabValue] = useState(0);
    
    return (
      <Box sx={{ mt: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" />
          <Tab label="Activity" />
          <Tab label="Tickets" />
          <Tab label="Audit Log" />
        </Tabs>
        
        {tabValue === 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Contact Information</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Mobile: {user.mobile}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Account Information</Typography>
              <Typography>Status: <StatusChip status={user.status === 'pending_kyc' ? 'pending' : user.status} /></Typography>
              <Typography>
                Roles: {user.roles.map(role => (
                  <Chip 
                    key={role} 
                    label={role} 
                    size="small" 
                    sx={{ mr: 0.5, textTransform: 'capitalize' }} 
                  />
                ))}
              </Typography>
              <Typography>
                Created: {format(new Date(user.createdAt), 'PP')}
              </Typography>
            </Grid>
            
            {user.kycDocuments && user.kycDocuments.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">KYC Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, overflowX: 'auto' }}>
                  {user.kycDocuments.map((_doc, index) => (
                    <Paper key={index} sx={{ p: 1, textAlign: 'center', minWidth: 120 }}>
                      <Typography variant="body2">Document {index + 1}</Typography>
                      <Button size="small">View</Button>
                    </Paper>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
        
        {tabValue === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography>Recent activity will appear here</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const UserEditForm = ({ user, onCancel }: { user: User; onCancel: () => void }) => {
    const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      mobile: Yup.string().required('Mobile is required'),
      status: Yup.string().required('Status is required'),
      roles: Yup.array().min(1, 'At least one role is required')
    });
    
    return (
      <Formik
        initialValues={user}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateUser({ id: user.id, data: values });
          onCancel();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="name"
                  label="Full Name"
                  fullWidth
                  size="small"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  size="small"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  disabled={!can('update_email', 'user')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="mobile"
                  label="Mobile"
                  fullWidth
                  size="small"
                  error={touched.mobile && !!errors.mobile}
                  helperText={touched.mobile && errors.mobile}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="status"
                  label="Status"
                  select
                  fullWidth
                  size="small"
                >
                  {(['active', 'pending_kyc', 'suspended', 'banned'] as UserStatus[]).map(status => (
                    <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  name="roles"
                  label="Roles"
                  select
                  SelectProps={{ multiple: true }}
                  fullWidth
                  size="small"
                >
                  {(['player', 'agent', 'super-admin', 'auditor', 'support'] as UserRole[]).map(role => (
                    <MenuItem key={role} value={role} sx={{ textTransform: 'capitalize' }}>
                      {role}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="outlined" onClick={onCancel} size="small">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    startIcon={<Save />}
                    size="small"
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header with search and filters */}
      <Paper sx={{ p: 1, mb: 1 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search users..."
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
              }}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={params.status}
              onChange={(e) => setParams(prev => ({ ...prev, status: e.target.value as UserStatus | 'all' }))}
            >
              <MenuItem value="all">All</MenuItem>
              {(['active', 'pending_kyc', 'suspended', 'banned'] as UserStatus[]).map(status => (
                <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                  {status.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Role"
              value={params.role}
              onChange={(e) => setParams(prev => ({ ...prev, role: e.target.value as UserRole | 'all' }))}
            >
              <MenuItem value="all">All</MenuItem>
              {(['player', 'agent', 'super-admin', 'auditor', 'support'] as UserRole[]).map(role => (
                <MenuItem key={role} value={role} sx={{ textTransform: 'capitalize' }}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
              disabled={isFetching}
              size="small"
            >
              Refresh
            </Button>
            {can('create', 'user') && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  // Handle create new user
                }}
                size="small"
              >
                New
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Data Grid */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DataGrid
          rows={data?.items || []}
          columns={columns}
          loading={isLoading || isFetching}
          pagination
          paginationMode="server"
          rowCount={data?.total || 0}
          pageSizeOptions={[10, 20, 50]}
          paginationModel={{ page: params.page, pageSize: params.pageSize }}
          onPaginationModelChange={(model) => setParams(prev => ({ ...prev, ...model }))}
          onRowClick={handleRowClick}
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar,
            footer: () => null
          }}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto'
            }
          }}
        />
      </Paper>
      
      {/* User Detail Drawer */}
      <Drawer
        anchor="right"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        PaperProps={{ 
          sx: { 
            width: { xs: '100%', sm: '90%', md: '70%', lg: '50%' },
            maxWidth: 800
          } 
        }}
      >
        {detailUser && (
          <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="div" noWrap>
                {detailUser.name}
              </Typography>
              <IconButton onClick={() => setDetailOpen(false)} size="small">
                <Close />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2, gap: 1, flexWrap: 'wrap' }}>
              <StatusChip status={detailUser.status === 'pending_kyc' ? 'pending' : detailUser.status} />
              <Typography variant="body2" color="text.secondary" noWrap>
                Last login: {format(new Date(detailUser.lastLogin), 'PPpp')}
              </Typography>
            </Box>
            
            {editMode ? (
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <UserEditForm 
                  user={detailUser} 
                  onCancel={() => setEditMode(false)} 
                />
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                  <UserDetailTabs user={detailUser} />
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {can('update', 'user') && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setEditMode(true)}
                      size="small"
                    >
                      Edit
                    </Button>
                  )}
                  {can('update_status', 'user') && (
                    <Button
                      variant="outlined"
                      startIcon={<Block />}
                      onClick={() => setBanModal({ open: true, user: detailUser })}
                      color={detailUser.status === 'banned' ? 'primary' : 'error'}
                      size="small"
                    >
                      {detailUser.status === 'banned' ? 'Unban' : 'Restrict'}
                    </Button>
                  )}
                  {can('reset_password', 'user') && (
                    <Button
                      variant="outlined"
                      startIcon={<LockReset />}
                      onClick={() => setResetModal({ open: true, user: detailUser })}
                      size="small"
                    >
                      Reset
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Drawer>
      
      {/* Action Modals */}
      {banModal.user && (
        <Dialog 
          open={banModal.open} 
          onClose={() => setBanModal({ open: false, user: null })}
          fullScreen={window.innerWidth < 600}
        >
          <DialogTitle>
            {banModal.user.status === 'banned' ? `Unban ${banModal.user.name}` : `Restrict ${banModal.user.name}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {banModal.user.status === 'banned' 
                ? "This user will regain full access to their account."
                : "This will restrict the user's account access."}
            </DialogContentText>
            
            {banModal.user.status !== 'banned' && (
              <>
                <TextField
                  label="Reason (optional)"
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                  size="small"
                />
                
                <TextField
                  label="Duration (optional)"
                  fullWidth
                  placeholder="e.g., 7 days"
                  size="small"
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBanModal({ open: false, user: null })} size="small">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (banModal.user) {
                  changeStatus({ 
                    id: banModal.user.id, 
                    status: banModal.user.status === 'banned' ? 'active' : 'banned' 
                  });
                }
                setBanModal({ open: false, user: null });
              }} 
              color={banModal.user && banModal.user.status === 'banned' ? 'primary' : 'error'}
              variant="contained"
              size="small"
            >
              {banModal.user && banModal.user.status === 'banned' ? 'Unban' : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {resetModal.user && (
        <Dialog 
          open={resetModal.open} 
          onClose={() => setResetModal({ open: false, user: null })}
          fullScreen={window.innerWidth < 600}
        >
          <DialogTitle>Reset Password for {resetModal.user.name}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              How would you like to reset this user's password?
            </DialogContentText>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Mail />}
                onClick={() => {
                  if (resetModal.user) {
                    resetPassword({ id: resetModal.user.id, method: 'email' });
                  }
                  setResetModal({ open: false, user: null });
                }}
                fullWidth
                size="small"
              >
                Send Email
              </Button>
              <Button
                variant="outlined"
                startIcon={<LockReset />}
                onClick={() => {
                  if (resetModal.user) {
                    resetPassword({ id: resetModal.user.id, method: 'temporary' });
                  }
                  setResetModal({ open: false, user: null });
                }}
                fullWidth
                size="small"
              >
                Temporary Password
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetModal({ open: false, user: null })} size="small">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // autoHideDuration={5000}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default UserManagement;
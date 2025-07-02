import { useState, useEffect } from 'react';
import { 
  DataGrid, 
  type GridColDef, 
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { Edit, Security } from '@mui/icons-material';
import { useAuth } from '../../../auth/AuthContext';
import { fetchAdmins } from '../services/adminService';
import { RoleEditDialog } from './RoleEditDialog';
import { RoleMatrix } from './RoleMatrix';
import type { Admin } from '../types';

export const AdminList = () => {
  const { hasPermission } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showRoleMatrix, setShowRoleMatrix] = useState(false);

  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      try {
        const data = await fetchAdmins();
        setAdmins(data.admins);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hasPermission('ADMIN_MANAGE')) {
      loadAdmins();
    }
  }, [hasPermission]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 1,
      renderCell: (params) => (
        <span style={{ 
          fontWeight: 700,
          color: params.value === 'SUPER_ADMIN' 
            ? '#d32f2f' 
            : '#1976d2'
        }}>
          {params.value}
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.7,
      renderCell: (params) => (
        <span style={{ 
          color: params.value === 'active' ? 'green' : 'gray'
        }}>
          {params.value}
        </span>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit Role"
          onClick={() => setSelectedAdmin(params.row as Admin)}
          disabled={!hasPermission('ADMIN_MANAGE')}
        />
      ]
    }
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 16 
      }}>
        <h2>Admin Management</h2>
        <button 
          onClick={() => setShowRoleMatrix(true)}
          className="matrix-toggle"
        >
          <Security /> View Role Matrix
        </button>
      </div>

<div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: 600 }}>
      <DataGrid
        rows={admins}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        sx={
          {
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }
        }
      />
      </div>
    </div>

      {selectedAdmin && (
        <RoleEditDialog
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onRoleUpdate={(updatedAdmin) => {
            setAdmins(admins.map(a => 
              a.id === updatedAdmin.id ? updatedAdmin : a
            ));
          }}
        />
      )}

      <RoleMatrix
        open={showRoleMatrix}
        onClose={() => setShowRoleMatrix(false)}
      />
    </div>
  );
};
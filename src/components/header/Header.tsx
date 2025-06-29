import { AppBar, Toolbar, IconButton, Avatar, Box, Typography, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgb(255, 255, 255)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  //boxShadow: '0 2px 13px rgba(0, 0, 0, 0.1)',
  //boxShadow: '0 6px 13px rgb(255, 255, 255)',
    boxShadow: '0 4px 13 px rgba(0,0,0,0.1)',
  zIndex: theme.zIndex.appBar
}));

const Header = ({ 
  onMenuClick}: { 
  onMenuClick: () => void; 
  sidebarOpen: boolean 
}) => (
  <StyledAppBar position="fixed" elevation={0}>
    <Toolbar 
      sx={{ 
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        minHeight: '64px !important',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: 2,
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: '-0.015em'
          }}
        >
          Lottery Admin Panel
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          size="medium"
          aria-label="notifications"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          <Badge badgeContent={3} color="primary">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
        
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36,
            border: '2px solid',
            borderColor: 'primary.light',
            bgcolor: 'primary.main',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          NH
        </Avatar>
      </Box>
    </Toolbar>
  </StyledAppBar>
);

export default Header;
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, styled } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  AdminPanelSettings,
  Event,
  AddCircleOutline,
  MoneyOffRounded,
  AttachMoney
} from '@mui/icons-material';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 256,
    boxSizing: 'border-box',
    top: '64px',
    height: 'calc(100% - 64px)',
    borderRight: 'none',
    background: theme.palette.background.paper,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    padding: '8px 12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Create Draw', icon: <AddCircleOutline />, path: '/createdraw' },
  { text: 'Manage Draws', icon: <Event />, path: '/managedraws' },
  { text: 'Manage Admin ', icon: <AdminPanelSettings />, path: '/manageadmin' },
  { text: 'Manage Finance ', icon: <MoneyOffRounded />, path: '/financedashboard' },
  { text: 'Payout Dash ', icon: <AttachMoney />, path: '/payoutdashboard' },


];

const Sidebar = ({ 
  open, 
  onClose,
  isMobile
}: { 
  open: boolean; 
  onClose: () => void;
  isMobile: boolean;
}) => {
  const location = useLocation();

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      <Divider sx={{ 
        borderColor: 'rgba(0, 0, 0, 0)',
        mx: 2,
        my: 1 
      }} />
      <List sx={{ px: 1.5 }}>
        {navItems.map(item => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => isMobile && onClose()}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: '10px',
              px: 2,
              py: 0.75,
              my: 1,
              height: 48,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(3, 128, 252, 0.1)',
              },
              '&.Mui-selected': {
                //backgroundColor: theme => theme.palette.primary.light,
                color: theme => theme.palette.primary.main,
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(25, 118, 210, 0.2)',
                '& .MuiListItemIcon-root': {
                  color: theme => theme.palette.primary.main,
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  //backgroundColor: theme => theme.palette.primary.main,
                  //borderTopRightRadius: '4px',
                  //borderBottomRightRadius: '4px',
                },
                '& .MuiTypography-root': {
                  fontWeight: 600,
                }
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'text.secondary',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '0.925rem',
                fontWeight: 500,
                letterSpacing: '0.015em',
              }} 
            />
          </ListItemButton>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
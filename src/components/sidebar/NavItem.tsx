import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, useMatch } from 'react-router-dom';

const NavItem = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => {
  const match = useMatch(to);
  
  return (
    <ListItemButton
      component={RouterLink}
      to={to}
      selected={!!match}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default NavItem;
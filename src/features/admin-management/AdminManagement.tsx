import { AdminList } from './components/AdminList';
import { Box,  } from '@mui/material';
import {Typography} from '../../components/ui';

export const AdminManagement = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administrator Controls
      </Typography>
      <AdminList />
    </Box>
  );
};
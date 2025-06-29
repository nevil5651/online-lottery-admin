// src/components/layout/DetailDrawer.tsx
import { Drawer, Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const DetailDrawer = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children
}: DetailDrawerProps) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        width: { xs: '100%', sm: '90%', md: '70%', lg: '50%' },
        maxWidth: 800
      }
    }}
  >
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      
      {subtitle && (
        <Box sx={{ mt: 1, mb: 2 }}>
          {subtitle}
        </Box>
      )}
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </Box>
      
      {actions && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {actions}
        </Box>
      )}
    </Box>
  </Drawer>
);
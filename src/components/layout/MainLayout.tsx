import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';

const MainLayout = () => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Auto-close sidebar on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
      />
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: { sm: `${sidebarOpen ? 240 : 0}px` },
        }}
      >
        <Toolbar /> {/* Spacer for header */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
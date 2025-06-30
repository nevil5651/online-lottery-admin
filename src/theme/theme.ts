import { createTheme } from '@mui/material/styles';

const theme = createTheme({
   palette: {
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
    },
    text: {
      primary: '#2d3748',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui',
    h6: { fontWeight: 600 },
    body2: { color: '#64748b' },
  },
  shape: {
    borderRadius: 8, // Standard border radius
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)', // xs
    '0 4px 20px rgba(0,0,0,0.08)', // sm (matches your card)
    '0 6px 24px rgba(0,0,0,0.12)', // md (matches your card hover)
    '0 8px 32px rgba(0,0,0,0.16)','','','','','','','','','','','','','','','','','','','','' // lg
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '1px 0 24px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
   palette: {
    mode: "light",
    background: {
      default: "#F5F8FF",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#2563EB",
    },
    secondary: {
      main: "#1D4ED8",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  shape: {
    borderRadius: 12,
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
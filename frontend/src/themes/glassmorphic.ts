import { createTheme, PaletteMode } from '@mui/material/styles';

// Dark mode color palette with depth and sophistication
const palette = {
  mode: 'dark' as PaletteMode,
  primary: {
    main: 'rgba(100, 130, 255, 0.8)', // Vibrant but soft blue
    light: 'rgba(130, 160, 255, 0.6)',
    dark: 'rgba(70, 100, 230, 0.9)',
  },
  secondary: {
    main: 'rgba(255, 110, 180, 0.8)', // Soft magenta
    light: 'rgba(255, 150, 200, 0.6)',
    dark: 'rgba(220, 80, 150, 0.9)',
  },
  background: {
    // Deep, layered background with subtle gradients
    default: 'linear-gradient(135deg, rgba(30,40,60,1) 0%, rgba(20,25,40,1) 100%)',
    paper: 'rgba(40, 50, 70, 0.6)', // Glassmorphic dark background
  },
  text: {
    primary: 'rgba(230, 235, 255, 0.9)',
    secondary: 'rgba(200, 210, 230, 0.7)',
  },
};

const theme = createTheme({
  palette,
  shape: {
    borderRadius: 16, // Soft, rounded corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1a2035', // Deep background color
          backgroundImage: 
            'radial-gradient(circle at 20% 90%, rgba(100,130,255,0.1) 0%, transparent 50%),' +
            'radial-gradient(circle at 80% 10%, rgba(255,110,180,0.1) 0%, transparent 50%)',
          backgroundAttachment: 'fixed',
          color: 'rgba(230, 235, 255, 0.9)',
        },
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: 'rgba(50, 60, 80, 0.3)',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(67, 70, 85, 0.5)',
          borderRadius: '4px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(40, 50, 70, 0.6)', // Dark, translucent sidebar
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          borderRight: '1px solid rgba(100, 130, 255, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 40, 60, 0.7)', // Dark, translucent navbar
          backdropFilter: 'blur(15px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(100, 130, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(50, 60, 80, 0.6)', // Dark message bubbles
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          border: '1px solid rgba(100, 130, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            backgroundColor: 'rgba(100, 130, 255, 0.9)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(50, 60, 80, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(100, 130, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(100, 130, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(100, 130, 255, 0.8)',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      color: 'rgba(230, 235, 255, 0.9)',
    },
    body1: {
      color: 'rgba(230, 235, 255, 0.9)',
      lineHeight: 1.6,
    },
  },
});

export default theme;
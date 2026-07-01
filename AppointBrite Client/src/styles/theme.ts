/**
 * MUI Theme configuration for AppointBrite.
 * Custom shades design featuring glassmorphism, dynamic gradients, and modern components.
 */
import { createTheme, type ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:active': {
            transform: 'scale(0.96)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          }
        }
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
            boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
              transform: 'translateY(-2px)',
            }
          }
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%)',
            boxShadow: '0 4px 14px 0 rgba(255, 107, 107, 0.39)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E05050 0%, #FF6B6B 100%)',
              boxShadow: '0 6px 20px rgba(255, 107, 107, 0.5)',
              transform: 'translateY(-2px)',
            }
          }
        }
      ],
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'all 0.3s ease-in-out',
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)',
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.2s',
        },
      },
    },
  },
};

/** Light theme */
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FFA0A0',
      dark: '#E05050',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#3B82F6' },
  },
  components: {
    ...baseTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(15, 23, 42, 0.04)',
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.15), 0 1px 3px rgba(0,0,0,0.02)',
          }
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
        }
      }
    }
  },
});

/** Dark theme */
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FFA0A0',
      dark: '#E05050',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#090E17',
      paper: '#121A2A',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: 'rgba(248, 250, 252, 0.08)',
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#3B82F6' },
  },
  components: {
    ...baseTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'linear-gradient(145deg, #151F32, #0C121E)',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.4)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.25)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
          }
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(9, 14, 23, 0.8)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
            }
          }
        }
      }
    }
  },
});

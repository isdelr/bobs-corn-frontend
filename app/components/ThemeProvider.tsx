"use client";
import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Custom color palette inspired by the game UI colors
const lightPalette: PaletteOptions = {
    mode: 'light',
    primary: {
        light: '#81C784',
        main: '#4CAF50',
        dark: '#388E3C',
        contrastText: '#ffffff',
    },
    secondary: {
        light: '#4DD0E1',
        main: '#26C6DA',
        dark: '#00ACC1',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    error: {
        light: '#EF5350',
        main: '#F44336',
        dark: '#D32F2F',
        contrastText: '#ffffff',
    },
    warning: {
        light: '#FFB74D',
        main: '#FF9800',
        dark: '#F57C00',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
        light: '#4FC3F7',
        main: '#29B6F6',
        dark: '#0288D1',
        contrastText: '#ffffff',
    },
    success: {
        light: '#81C784',
        main: '#4CAF50',
        dark: '#388E3C',
        contrastText: '#ffffff',
    },
    grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#F5F5F5',
        A200: '#EEEEEE',
        A400: '#BDBDBD',
        A700: '#616161',
    },
    background: {
        default: '#F8F7FA',
        paper: '#FFFFFF',
    },
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },
};
const darkPalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        light: '#A5D6A7',
        main: '#81C784',
        dark: '#66BB6A',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
        light: '#80DEEA',
        main: '#4DD0E1',
        dark: '#26C6DA',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    error: {
        light: '#EF5350',
        main: '#F44336',
        dark: '#E53935',
        contrastText: '#ffffff',
    },
    warning: {
        light: '#FFB74D',
        main: '#FFA726',
        dark: '#FF9800',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
        light: '#81D4FA',
        main: '#4FC3F7',
        dark: '#29B6F6',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    success: {
        light: '#A5D6A7',
        main: '#81C784',
        dark: '#66BB6A',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#F5F5F5',
        A200: '#EEEEEE',
        A400: '#BDBDBD',
        A700: '#616161',
    },
    background: {
        default: '#121212',
        paper: '#1E1E1E',
    },
    text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
        active: '#ffffff',
        hover: 'rgba(255, 255, 255, 0.08)',
        hoverOpacity: 0.08,
        selected: 'rgba(255, 255, 255, 0.16)',
        selectedOpacity: 0.16,
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(255, 255, 255, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.24,
    },
};
// Extended theme with custom colors from the game UI
const createExtendedTheme = (mode: 'light' | 'dark' = 'light') => {
    const palette = mode === 'light' ? lightPalette : darkPalette;
    return createTheme({
        palette: {
            ...palette,
            // Additional custom colors can be added through module augmentation
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 600,
            },
            h2: {
                fontWeight: 600,
            },
            h3: {
                fontWeight: 600,
            },
            h4: {
                fontWeight: 600,
            },
            h5: {
                fontWeight: 600,
            },
            h6: {
                fontWeight: 600,
            },
            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '8px 16px',
                        transition: 'all 0.2s ease-in-out',
                    },
                    contained: {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: mode === 'light'
                            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
                            : '0 4px 20px rgba(0, 0, 0, 0.3)',
                        borderRadius: 16,
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                    elevation1: {
                        boxShadow: mode === 'light'
                            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                            : '0 2px 8px rgba(0, 0, 0, 0.24)',
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    },
                },
            },
        },
    });
};
type Mode = 'light' | 'dark';

export const ThemeModeContext = React.createContext<{
    mode: Mode;
    toggleMode: () => void;
}>({ mode: 'light', toggleMode: () => {} });

export const useThemeMode = () => React.useContext(ThemeModeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = React.useState<Mode>('light');

    // Initialize from localStorage or system preference
    React.useEffect(() => {
        try {
            const stored = typeof window !== 'undefined' ? window.localStorage.getItem('mui-mode') : null;
            const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial: Mode = stored === 'light' || stored === 'dark' ? (stored as Mode) : (prefersDark ? 'dark' : 'light');
            setMode(initial);
        } catch (_) {
            // noop
        }
    }, []);

    const toggleMode = React.useCallback(() => {
        setMode(prev => {
            const next: Mode = prev === 'light' ? 'dark' : 'light';
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('mui-mode', next);
                }
            } catch (_) {
                // noop
            }
            return next;
        });
    }, []);

    React.useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.colorScheme = mode;
        }
    }, [mode]);

    const theme = React.useMemo(() => createExtendedTheme(mode), [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeModeContext.Provider>
    );
}

// Export themes for potential external usage
export const lightTheme = createExtendedTheme('light');
export const darkTheme = createExtendedTheme('dark');
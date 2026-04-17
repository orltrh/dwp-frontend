import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import App from "./App"

const theme = createTheme({
  palette: {
    primary: {
      main: "#E65100",
      light: "#FF8330",
      dark: "#AC3B00",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#FF8F00",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#FEF3E7",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#757575"
    },
    success: {
      main: "#2E7D32",
      light: "#E8F5E9"
    },
    divider: "#F0E6DC"
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: { fontWeight: 700, letterSpacing: "-0.5px" },
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700, letterSpacing: "-0.25px" },
    h6: { fontWeight: 700, letterSpacing: "-0.25px" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em"
    },
    caption: { lineHeight: 1.5 }
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.06)",
    "0px 2px 6px rgba(0,0,0,0.06)",
    "0px 4px 12px rgba(0,0,0,0.08)",
    "0px 8px 24px rgba(0,0,0,0.08)",
    "0px 12px 32px rgba(0,0,0,0.1)",
    ...Array(19).fill("none")
  ],
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: "10px 24px",
          fontSize: "0.9rem"
        },
        sizeSmall: {
          padding: "6px 16px",
          fontSize: "0.8rem"
        },
        sizeLarge: {
          padding: "14px 32px",
          fontSize: "1rem"
        },
        contained: {
          "&:hover": { filter: "brightness(0.92)" }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": { borderWidth: "1.5px" }
        }
      }
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            "& fieldset": { borderColor: "#E8DDD6" },
            "&:hover fieldset": { borderColor: "#E65100" },
            "&.Mui-focused fieldset": {
              borderColor: "#E65100",
              borderWidth: "1.5px"
            }
          }
        }
      }
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #F0E6DC",
          borderRadius: 16,
          transition: "box-shadow 0.2s ease, transform 0.2s ease"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        sizeSmall: { fontSize: "0.7rem" }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: "8px"
        }
      }
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #F0E6DC"
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: "100px !important",
          border: "1.5px solid #F0E6DC",
          padding: "6px 20px",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#757575",
          textTransform: "none",
          "&.Mui-selected": {
            backgroundColor: "#E65100",
            color: "#FFFFFF",
            borderColor: "#E65100",
            "&:hover": {
              backgroundColor: "#AC3B00"
            }
          }
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: { borderTop: "1px solid #F0E6DC", height: 64 }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected": { color: "#E65100" },
          minWidth: 60
        },
        label: {
          fontSize: "0.7rem",
          "&.Mui-selected": { fontSize: "0.7rem" }
        }
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

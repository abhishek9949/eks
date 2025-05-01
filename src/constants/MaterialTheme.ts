// theme.js
import { createTheme } from "@mui/material/styles";


// Extend MUI Palette to support custom colors
declare module "@mui/material/styles" {
  interface Palette {
    blue: Palette["primary"];
    gray: Palette["primary"];
  }
  interface PaletteOptions {
    blue?: PaletteOptions["primary"];
    gray?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    common: {
      white: "#FFFFFF",
    },
    primary: {
      main: "#006BA6",
    },
    blue: {
      main: "#0284c7", // bule (default)
    },
    secondary: {
      main:"#667085",
      50: "#F3F4F6", // gray.2
      100: "#E6EBF1", // stroke
      200: "#D8D8D8", // gray.3
      300: "#C6C6C6", // gray (default)
      400: "#494949", // gray.6
      500: "#4B4B4B", // gray.4
      600: "#4C4C4D", // gray.5
      700: "#333333", // gray.7
      800: "#27303E", // stroke-dark
      900: "#111928", // dark (default)
    },
    gray: {
      main: "#000000", //S1
      900: "#363636", //S2
      800: "#4B4B4B", //S3
      600: "#737373", //S4
      500: "#C6C6C6", //S5
      300: "#DEDEDE", //S6
      200: "#EAEAEA", //S7
      100: "#F4F4F4", //S8
    },
    success: {
      // Use success for green
      main: "#22AD5C", // green (default)
      light: "#10B981", // green.1
    },
    error: {
      main: "#EB5757", // red (default)
      light: "#FEF3F3", // red.2
      dark: "#B3251E", // red.3
    },
    text: {
      primary: "#111928", // dark (default)
      secondary: "#6B7280", // dark.1
      disabled: "#C6C6C6", // gray (default)
    },
    background: {
      default: "rgba(0, 0, 0, 0)", // Transparent background color
      paper: "#FFFFFF",
    },
    divider: "#D8D8D8", // gray.3
  },
  typography: {
    fontFamily: '"Folty", sans-serif',
    // You can specify variants for Typography
    h1: { fontFamily: '"Folty", sans-serif' },
    h2: { fontFamily: '"Folty", sans-serif' },
    h3: { fontFamily: '"Folty", sans-serif' },
    body1: { fontFamily: '"Folty", sans-serif' },
    body2: { fontFamily: '"Folty", sans-serif' },
    button: { fontFamily: '"Folty", sans-serif' },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
          textTransform: "none", // Optional: Removes uppercase for buttons
          boxShadow: "none !important",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
          textTransform: "none", // Removes uppercase for tabs
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          fontFamily: '"Folty", sans-serif',
        },
      },
    },
  },
});

export default theme;

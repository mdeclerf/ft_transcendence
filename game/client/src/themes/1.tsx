
// https://dragoshmocrii.com/material-ui-custom-theme-and-typescript/
import { createTheme } from '@material-ui/core/styles';

const theme_1 = {
    palette: {
        primary: {
            main: '#1512ED', 
        },
        secondary: {
            main: '#ED127C', 
        },
        error: {
            main: '#12ED83',
        },
        background: {
            default: '#6e7480',
        },
    },

	typography: {
		fontFamily: "'Montserrat', sans-serif",
		textTransform: "none",
	},
	sidebarWidth: 240
} as const;

type CustomTheme = {
	[Key in keyof typeof theme_1]: typeof theme_1[Key]
}
declare module '@material-ui/core/styles/createTheme' {
    interface Theme extends CustomTheme { }
    interface ThemeOptions extends CustomTheme { }
}
export default createTheme(theme_1);
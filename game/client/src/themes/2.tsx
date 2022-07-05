import { createTheme } from '@material-ui/core/styles';

const theme_2 = {
    palette: {
        primary: {
            main: '#B7E453',
        },
        secondary: {
            main: '#E4536F',
        },
        error: {
            main: '#8053E4',
        },
        background: {
            default: '#FFF',
        },
    },
    sidebarWidth: 240
} as const;

type CustomTheme = {
    [Key in keyof typeof theme_2]: typeof theme_2[Key]
}

declare module '@material-ui/core/styles/createTheme' {
    interface Theme extends CustomTheme { }
    interface ThemeOptions extends CustomTheme { }
}

export default createTheme(theme_2);
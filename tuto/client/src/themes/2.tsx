import { createTheme } from '@material-ui/core/styles';

const theme_2 = {
    palette: {
        primary: {
            main: '#FFAEBC',
        },
        secondary: {
            main: '#A0E7E5',
        },
        error: {
            main: '#B4F8C8',
        },
        background: {
            default: '#FBE7C6',
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
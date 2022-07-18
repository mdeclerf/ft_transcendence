import React from 'react';
import  theme_2  from './themes/2';
import  theme_1  from './themes/1';
import Canvas from './components/canvas';
import { ThemeProvider } from '@mui/material/styles';
import { Grid } from '@material-ui/core';
import Button from "@mui/material/Button";
import { CssBaseline } from "@mui/material";

function App() {

	const [colors, setColors] = React.useState(true);

	return (
		<ThemeProvider theme={colors ? theme_1 : theme_2}>
		<CssBaseline/>
		<Button variant="contained" onClick={() => setColors((prev) => !prev)}>Toggle Theme</Button>

			<Grid container justifyContent='center'>
				<Canvas/>
			</Grid>
		</ThemeProvider>
	);
}

export default App;

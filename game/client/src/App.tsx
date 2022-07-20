import React from 'react';
import  theme_2  from './themes/2';
import  theme_1  from './themes/1';
import Canvas from './components/canvas';
import Mode from './components/mode';
import { ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Button from "@mui/material/Button";
import { CssBaseline } from "@mui/material";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom';

function App() {

	const [colors, setColors] = React.useState(true);

	return (
		<ThemeProvider theme={colors ? theme_1 : theme_2}>
			<CssBaseline/>
			<Button variant="contained" onClick={() => setColors((prev) => !prev)}>Toggle Theme</Button>

			<Router>

			<Mode/>

			<Routes>
				<Route path='/chat' element={
					<Grid container justifyContent='center'>
						<Canvas/>
					</Grid>
				}>
				</Route>

				<Route path='/normal' element={
					<Grid container justifyContent='center'>
						<Canvas/>
					</Grid>
				}>
				</Route>
			</Routes>

			</Router>
		</ThemeProvider>
	);
}

export default App;

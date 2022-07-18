import React from 'react';
import  theme_2  from './themes/2';
import  theme_1  from './themes/1';
import Canvas from './components/canvas';
import { ThemeProvider } from '@mui/material/styles';
import { Grid } from '@material-ui/core';
import Button from "@mui/material/Button";
import { CssBaseline } from "@mui/material";
import { ButtonGroup } from '@material-ui/core';
import Box from '@mui/material/Box';

function App() {

	const [colors, setColors] = React.useState(true);
	let mode:string = "";

	const handleChatMode = () => {
		mode = "chat";
		console.log(mode);
	};

	const handleNormalMode = () => {
		mode = "normal";
		console.log(mode);
	};

	return (
		<ThemeProvider theme={colors ? theme_1 : theme_2}>
		<CssBaseline/>
		<Button variant="contained" onClick={() => setColors((prev) => !prev)}>Toggle Theme</Button>

		<Box textAlign='center'>
			<ButtonGroup  disableElevation color="primary" variant="contained">
				<Button onClick={handleChatMode}>Chat</Button>
				<Button onClick={handleNormalMode}>Normal</Button>
			</ButtonGroup>
		</Box>

		{ (mode === "chat" || mode === "normal") && 
			<Grid container justifyContent='center'>
				<Canvas/>
			</Grid>
		}

		</ThemeProvider>
	);
}

export default App;

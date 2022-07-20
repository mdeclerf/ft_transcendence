import React from 'react';
import { io } from "socket.io-client";
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ws = io("http://localhost:3001");
// const ws = io("http://10.2.6.5:3001");

let mode: string = "";

const handleChatMode = () => {
	mode = "chat";
	ws.emit("mode_choice", {mode});
	console.log(mode);
};

const handleNormalMode = () => {
	mode = "normal";
	ws.emit("mode_choice", {mode});
	console.log(mode);
};

function Mode() {
	const location = useLocation();
	return (
		<>
		{ ( location.pathname === "/" ) &&
			<Box textAlign='center'>
			<ButtonGroup  disableElevation color="primary" variant="contained" size="large">
				<Button component={Link} to="/chat" onClick={handleChatMode}>
					Chat mode
				</Button>

				<Button component={Link} to="/normal" onClick={handleNormalMode}>
					Normal mode
				</Button>
			</ButtonGroup>
			</Box> }
		</>
	);
}

export default Mode;

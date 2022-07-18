import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from 'react-router-dom';

import { ButtonGroup } from '@material-ui/core';
import Box from '@mui/material/Box';

<Router>
<div className="App">

	<Box textAlign='center'>
		<ButtonGroup  disableElevation color="primary" variant="contained">
			<Button component={Link} to="/chat">
				Chat mode
			</Button>

			<Button component={Link} to="/normal">
				Normal mode
			</Button>
		</ButtonGroup>
	</Box>

	<Routes>
		<Route path='/chat' element={
			<Grid container justifyContent='center'>
				<CanvasChat/>
			</Grid>
		}>
		</Route>

		<Route path='/normal' element={
			<Grid container justifyContent='center'>
				<CanvasNormal/>
			</Grid>
		}>
		</Route>
	</Routes>

</div>
</Router>
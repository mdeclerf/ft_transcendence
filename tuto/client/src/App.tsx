import React, { useEffect } from 'react';
import './App.css';

import Canvas from './components/canvas';

function App() {
	return (
	<>
	<div className="heading">
		<h2>Ping pong</h2>
	</div>
	<br></br>
    <div className="App">
    <Canvas/>
    </div>
	</>
  );
}

export default App;
import React, { useEffect } from 'react';
import './App.css';
import { io } from "socket.io-client";

import Canvas from './components/canvas';

function App() {
	return (
    <div className="App">
    <Canvas/>
    </div>
  );
}

export default App;
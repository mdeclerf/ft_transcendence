import React, { useState} from 'react';
import './App.css';

import Canvas from './components/canvas';

function App() {
  return (
    <div className="App">
	<span className = 'heading' >Pong</span>
    <Canvas/>
    </div>
  );
}

export default App;
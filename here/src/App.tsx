import React from 'react';
import './App.css';

import Canvas from './components/canvas';
import Play from './components/play';

function App() {
  return (
    <div className="App">
	<Play/>
    <Canvas/>
    </div>
  );
}

export default App;
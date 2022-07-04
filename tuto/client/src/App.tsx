import React, { useEffect, useState } from 'react';
import './styles.css';
import { themes } from "./theme";
import Canvas from './components/canvas';

function App() {

	type ThemeName = keyof typeof themes;
	const [themeName, setThemeName] = useState<ThemeName>('main');
	useEffect(() => {
		let name: ThemeName = 'dark';
		setThemeName(name);
	}, []);

	return (

	// <ThemeProvider value={themeName}>
		<div className="App">
		<Canvas/>
		</div>
	{/* </ThemeProvider> */}
  );
}

export default App;
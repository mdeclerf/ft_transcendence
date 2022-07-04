import React from 'react';
import { createTheming } from 'react-color-theme';

export const [ThemeProvider, useTheme, themes] = createTheming(
	{
		app_background: 'white',
		canvas_background: '#8306B7',
		high_1: '#08F7B0',
		high_2: '#F7B008',
		font: 'white'
	},

	{
		dark: {
			app_background: 'black',
			canvas_background: 'white',
			high_1: 'black',
			high_2: 'black',
			font: 'white'
		},

		blue: {
			app_background: '#7EC8E3',
			canvas_background: '#050A30',
			high_1: '#0000FF',
			high_2: '#FFD53D',
			font: 'white'
		},
	}
);


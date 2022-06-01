import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import GameContextProvider from './contexts/GameContextProvider'
import App from './App'
import ThemeContextProvider from './contexts/ThemeContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	/* <React.StrictMode> */
		<BrowserRouter>
			<ThemeContextProvider>
				<GameContextProvider>
						<App />
				</GameContextProvider>
			</ThemeContextProvider>
		</BrowserRouter>
		
	/* </React.StrictMode> */
)

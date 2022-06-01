import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import GameContextProvider from './contexts/GameContextProvider'
import ThemeContextProvider from './contexts/ThemeContextProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<BrowserRouter>
		<ThemeContextProvider>
			<GameContextProvider>
				<App />
			</GameContextProvider>
		</ThemeContextProvider>
	</BrowserRouter>
)

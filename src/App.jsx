import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import './assets/scss/App.scss'
import Login from './pages/Login'
import GameRoom from './pages/GameRoom'
import { useThemeContext } from './contexts/ThemeContextProvider'
import 'bootstrap/dist/css/bootstrap.css'


const App = () => {
	const { getStyle } = useThemeContext()

	return (
		<div id="App" className={getStyle()}>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/game/:room_id" element={<GameRoom />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
		</div>
	)
}

export default App

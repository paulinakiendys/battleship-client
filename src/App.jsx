import { Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/scss/App.scss'
import GameRoom from './pages/GameRoom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import { useThemeContext } from './contexts/ThemeContextProvider'

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

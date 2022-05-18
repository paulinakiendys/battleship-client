import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import NotFound from './pages/NotFound'
import './assets/scss/App.scss'
import Login from './pages/Login'
import GameRoom from './pages/GameRoom'
import Container from 'react-bootstrap/Container'

const App = () => {
	return (
		<div id="App">
			<Navigation />

			<Container className="py-3">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/game/:room_id" element={<GameRoom />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Container>
		</div>
	)
}

export default App

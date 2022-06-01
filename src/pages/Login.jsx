import { useState } from 'react'
import { Form, Button, Image } from 'react-bootstrap'
import { useGameContext } from '../contexts/GameContextProvider'
import { useNavigate } from "react-router-dom"
import SpaceDog from "../assets/images/space-dog.gif"
import PirateCat from "../assets/images/pirate-cat.gif"
import { useThemeContext } from '../contexts/ThemeContextProvider'
import Navigation from '../components/Navigation'

const Login = () => {
	// state variables
	const [disabled, setDisabled] = useState(false)
	const [username, setUsername] = useState('')
	const [waitingScreen, setWaitingScreen] = useState(false)

	// navigate function
	const navigate = useNavigate()

	// contexts
	const { setGameUsername, setClientID, socket } = useGameContext()
	const { theme } = useThemeContext()

	/**
	 * Function for when a user submits a username
	 * @param {object} e submit event
	 */
	const handleSubmit = async function (e) {
		e.preventDefault()
		// set game username
		setGameUsername(username)
		// set client id
		setClientID(socket.id)
		// Empty input field
		setUsername('')
		// Disable input field
		setDisabled(true)
		// emit request to join a room
		socket.emit('user:join', username, (status) => {
			// check if we are waiting for an opponent
			if (status.waiting) {
				setWaitingScreen(true)
				// listening for if an opponent has been found
				socket.on('user:ready', (room_id) => {
					// redirect to game room
					navigate(`/game/${room_id}`)
					// tell server that both users are ready
					socket.emit('users:ready', room_id)
				})
			} else if (!status.waiting) {
				// if we are not waiting for an opponent
				setWaitingScreen(false)
				// redirect to game room
				navigate(`/game/${status.room_id}`)
			}
		})
	}

	return (
		<>
			<Navigation />
			<div id="login">
				{!waitingScreen && (
					<>
						<h1 id="game-title" className="p-4">Battleship</h1>
						<Form className="text-center" onSubmit={handleSubmit}>
							<Form.Group className="mb-3" controlId="username">
								<Form.Control
									onChange={e => setUsername(e.target.value)}
									placeholder="Enter username"
									required
									type="text"
									value={username}
									disabled={disabled}
								/>
							</Form.Group>
							<Button
								variant="primary"
								type="submit"
								disabled={!username}>
								Join
							</Button>
						</Form>
					</>
				)}
				{waitingScreen && (
					<div className="d-flex justify-content-center flex-column align-items-center">
						{theme === 'light' ?
							<>
								<Image className="p-4" src={PirateCat} fluid />
								<h1>Waiting for a boat to plunder...</h1>
							</>
							:
							<>
								<Image className="p-4" src={SpaceDog} fluid />
								<h1>Waiting for an alien...</h1>
							</>
						}
					</div>
				)}
			</div>
		</>
	)
}

export default Login
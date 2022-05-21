import { useState } from 'react'
import { Form, Button, Image } from 'react-bootstrap'
import { useGameContext } from '../contexts/GameContextProvider'
import { useNavigate } from "react-router-dom"
import WaitingBoat from "../assets/images/boat-wave.gif"

const Login = () => {
	const [username, setUsername] = useState('')
	const [disabled, setDisabled] = useState(false)
	const { setGameUsername, socket } = useGameContext()
	const navigate = useNavigate()
	const [waitingScreen, setWaitingScreen] = useState(false)

	const handleSubmit = e => {
		e.preventDefault()

		// set game username
		setGameUsername(username)

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
					socket.emit('users:ready')
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
			{!waitingScreen && (
				<>
					<h1>Welcome to Battleship!</h1>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="username">
							<Form.Label>Username</Form.Label>
							<Form.Control
								onChange={e => setUsername(e.target.value)}
								placeholder="Enter your username"
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
							Play
						</Button>
					</Form>
				</>
			)}

			{waitingScreen && (
				<div className="d-flex justify-content-center flex-column align-items-center">
					<Image src={WaitingBoat} fluid />
					<h1>Waiting for opponent...</h1>
				</div>
			)}
		</>
	)
}

export default Login
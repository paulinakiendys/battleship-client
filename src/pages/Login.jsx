import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useGameContext } from '../contexts/GameContextProvider'
import { useNavigate } from "react-router-dom"

const Login = () => {
	const [username, setUsername] = useState('')
	const [message, setMessage] = useState('')
	const [disabled, setDisabled] = useState(false)
	const { socket } = useGameContext()
	const navigate = useNavigate()

	const handleSubmit = e => {
		e.preventDefault()

		// Empty input field
		setUsername('')

		// Disable input field
		setDisabled(true)

		// emit request to join a room
		socket.emit('user:join', username, (status, room_id) => {

			// check if we are waiting for an opponent
			if (status.waiting) {

				// show message
				setMessage('Waiting for an opponent...')

				/**
				 * @todo Hanna: hide form and show gif
				 */

				// listening for if an opponent has been found
				socket.on('user:ready', (room_id) => {

					// redirect to game room
					navigate(`/game/${room_id}`)

					// tell server that both users are ready
					socket.emit('users:ready')
				})
			} else if (!status.waiting) {
				// if we are not waiting for an opponent

				// redirect to game room
				navigate(`/game/${status.room_id}`)
			}
		})

	}

	return (
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
			<p>{message}</p>
		</>
	)
}

export default Login
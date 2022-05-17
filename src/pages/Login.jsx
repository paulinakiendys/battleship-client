import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useGameContext } from '../contexts/GameContextProvider'

const Login = () => {
	const [username, setUsername] = useState('')
	const [message, setMessage] = useState('')
	const [disabled, setDisabled] = useState(false)
	const { socket } = useGameContext()

	// the first user listening to if an opponent has been found
	socket.on('user:ready', (room_id) => {

		console.log(room_id)

		setMessage('No need to wait anymore! Redirecting to game room...')
		/**
		 * @todo navigate to game room
		 */

		// tell server that both users are ready
		socket.emit('users:ready')
	})

	const handleSubmit = e => {
		e.preventDefault()

		// Empty input field
		setUsername('')

		// Disable input field
		setDisabled(true)

		socket.emit('user:join', username, (status) => {

			console.log(status)

			// if it is the first user and we need to wait for an opponent, show message
			if (status.waitingStatus) {

				setMessage('Waiting for an opponent...')

				/**
				 * @todo Hanna: hide form and show gif
				 */
			} else if (!status.waitingStatus) {
				// if it is the second user and we don't need to wait for an opponent, redirect to game room

				setMessage('An opponent is ready. Redirecting to game room...')

				/**
				 * @todo navigate to game room
				 */

				console.log(status.room_id)
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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useGameContext } from '../contexts/GameContextProvider'

const Login = () => {
	const [username, setUsername] = useState('')
	const [room_id, setRoom_id] = useState('')
	const { setGameUsername } = useGameContext()
	const navigate = useNavigate()

	const handleSubmit = e => {
		e.preventDefault()

		// set game username
		setGameUsername(username)

		// redirect to game room
		navigate(`/rooms/${room_id}`)
	}

	return (
		<>
			<h1>Welcome to Battleship!</h1>
			<div id="login">
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="username">
						<Form.Label>Username</Form.Label>
						<Form.Control
							onChange={e => setUsername(e.target.value)}
							placeholder="Enter your username"
							required
							type="text"
							value={username}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="room_id">
						<Form.Label>Room</Form.Label>
						<Form.Control
							onChange={e => setRoom_id(e.target.value)}
							placeholder="Enter a room id"
							required
							type="text"
							value={room_id}
						/>
					</Form.Group>
					<Button variant="primary" type="submit" disabled={!username ||!room_id}>Play</Button>
				</Form>
			</div>
		</>
	)
}

export default Login
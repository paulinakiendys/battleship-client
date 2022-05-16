import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

const Login = () => {
	const [room_id, setRoom_id] = useState('')
	const navigate = useNavigate()

	const handleSubmit = e => {
		e.preventDefault()

		// redirect to game room
		navigate(`/rooms/${room_id}`)
	}

	return (
		<>
			<h1>Welcome to Battleship!</h1>
			<div id="login">
				<Form onSubmit={handleSubmit}>
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
					<Button variant="primary" type="submit" disabled={!room_id}>Play</Button>
				</Form>
			</div>
		</>
	)
}

export default Login
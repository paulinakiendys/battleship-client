import { useState } from 'react'
import { Form, Button, Image, Modal } from 'react-bootstrap'
import { useGameContext } from '../contexts/GameContextProvider'
import { useNavigate } from "react-router-dom"
import WaitingBoat from "../assets/images/boat-wave.gif"

const Login = () => {
	const [username, setUsername] = useState('')
	const [disabled, setDisabled] = useState(false)
	const { setGameUsername, setClientID, socket } = useGameContext()
	const navigate = useNavigate()
	const [waitingScreen, setWaitingScreen] = useState(false)

	//variables for modal
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleSubmit = async function (e) {
		e.preventDefault()

		// set game username
		setGameUsername(username)

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
			<div className="d-flex justify-content-end p-3">
				<Button className="rounded-circle" variant="secondary" onClick={handleShow}>
					?
				</Button>

				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>How to play?</Modal.Title>
					</Modal.Header>
					<Modal.Body>The rules are simple. Seek out your opponent's ships and destroy them. Click on a square to fire. Sink all your opponent's ships to win!</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
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
						<Image src={WaitingBoat} fluid />
						<h1>Waiting for an opponent...</h1>
					</div>
				)}
			</div>
		</>
	)
}

export default Login
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { useThemeContext } from '../contexts/ThemeContextProvider'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Button, Form, Image, InputGroup, ListGroup, Toast, ToastContainer, Container } from 'react-bootstrap'
import VictoryBaby from '../assets/images/victory-baby.png'
import { generateUserShips } from '../assets/js/randomize_flotilla'

const GameRoom = () => {
	// state variables
	const [hideButton, setHideButton] = useState(false)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [myTurn, setMyTurn] = useState(false)
	const [opponent, setOpponent] = useState('')
	const [showToast, setShowToast] = useState(false)
	const [turnMessage, setShowTurnMessage] = useState(false)
	const [remainingShipsLeftside, setRemainingShipsLeftside] = useState([1, 2, 3, 4])
	const [remainingShipsRightside, setRemainingShipsRightside] = useState([1, 2, 3, 4])
	const [winner, setWinner] = useState(null);
	const [winnerScreen, setWinnerScreen] = useState(false)

	// ref objects
	const opponentTableRef = useRef()
	const userTableRef = useRef()

	// helper functions
	const toggleShowToast = () => setShowToast(!showToast)

	// URL parameters
	const { room_id } = useParams()

	// navigate function
	const navigate = useNavigate()

	// contexts
	const { clientID, gameUsername, socket } = useGameContext()
	const { theme } = useThemeContext()

	const board = {
		"rows": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		"cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
	}

	/**
	 * Function to style boards if it was a 'hit' or a 'miss'
	 * @param {boolean} hit true if we have a 'hit', false if we have a 'miss'
	 * @param {string} username username of client emitting event
	 * @param {string} square id of cell that was clicked on
	 */
	const handleIncomingFire = useCallback(
		(hit, username, square) => {
			// check who emitted event
			if (gameUsername === username) {
				// if 'user', get opponent's table
				const opponentTable = opponentTableRef.current
				// get cell that was clicked on
				const cell = opponentTable.querySelector(`#${square}`)
				//disable clicked cell
				cell.classList.add('disabled')
				// check if it was a 'hit' or a 'miss'
				if (hit) {
					theme === 'light'
						? cell.innerText = '💣'
						: cell.innerText = '🛸'
					cell.style.backgroundColor = 'rgb(56, 5, 17)'
				} else {
					cell.style.backgroundColor = 'rgb(16, 49, 56)'
				}
			} else if (gameUsername !== username) {
				// if 'opponent', get user's table
				const userTable = userTableRef.current
				// get cell that was clicked on
				const cell = userTable.querySelector(`#${square}`)
				// check if it was a 'hit' or a 'miss'
				if (hit) {
					theme === 'light'
						? cell.innerText = '💣'
						: cell.innerText = '💥'
					cell.style.backgroundColor = 'rgb(56, 5, 17)'
				} else {
					cell.style.backgroundColor = 'rgb(19, 47, 54)'
				}
			}
		},
		[gameUsername, theme],
	)

	/**
	 * Function to get random starting player
	 */
	const handleStartingPlayer = useCallback(
		(randomUser) => {
			setShowTurnMessage(true)
			if (randomUser.username === gameUsername) {
				setMyTurn(true)
			}
		},
		[gameUsername],
	)

	/**
	 * Function to handle when a user clicks on a square
	 * @param {object} e click event
	 */
	const checkClick = (e) => {
		if (myTurn) {
			// id of square
			let shotFired = e.target.id
			// emit fire event
			socket.emit('user:fire', shotFired, room_id, gameUsername)
		} else {
			// show "Not your turn" toast
			toggleShowToast()
		}
	}

	/**
	 * Function to handle turns
	 */
	const handleNewTurn = useCallback(
		(user) => {
			// check who's turn it is
			if (user.username === gameUsername) {
				setMyTurn(false)
			} else {
				setMyTurn(true)
			}
		}, [gameUsername]
	)

	/**
	 * Function to update number of ships left
	 */
	const handleShipStatus = useCallback(
		(playerOneRemainingShips, playerOneID, playerTwoRemainingShips, playerTwoID) => {
			if (clientID === playerOneID) {
				setRemainingShipsLeftside(playerOneRemainingShips)
				setRemainingShipsRightside(playerTwoRemainingShips)
			} else if (clientID === playerTwoID) {
				setRemainingShipsLeftside(playerTwoRemainingShips)
				setRemainingShipsRightside(playerOneRemainingShips)
			}
		},
		[clientID],
	)

	/**
	 * Function to generate ships
	 */
	const handleGenerateShips = () => {
		// generate ships
		let userShips = generateUserShips()
		// access table
		const table = userTableRef.current
		// check if table belongs to user
		if (table.classList.contains("user")) {
			// loop through user ships
			userShips.forEach((ship) => {
				for (const row of table.rows) {
					for (const cell of row.cells) {
						// style cells
						if (ship.position.includes(cell.id)) {
							cell.style.backgroundColor = ship.color
						}
					}
				}
			})
		}

		// hide 'generate ships' button
		setHideButton(true)
		// tell server that client is ready to start the game
		socket.emit('game:start', userShips, (status) => {
			if (!status.room.ready) {
				// listen for waiting message
				socket.on('log:waiting', handleIncomingMessage)
			} else if (status.room.ready) {
				// emit that both users have positioned their ships
				socket.emit('ships:ready', room_id)
			}
		})
	}

	/**
	 * Function to display usernames
	 */
	const handleIncomingUsernames = useCallback(
		(userOne, userTwo) => {
			if (gameUsername === userOne) {
				setOpponent(userTwo)
			} else {
				setOpponent(userOne)
			}
		},
		[gameUsername],
	)

	/**
	 * Function to handle incoming chat messages
	 * @param {object} message object containing timestamp, username and content
	 */
	const handleIncomingMessage = message => {
		// add message to chat
		setMessages(prevMessages => [...prevMessages, message])
	}

	/**
	 * Function to handle when a user sends a chat message
	 * @param {object} e submit event
	 */
	const handleSubmit = e => {
		e.preventDefault()
		// send message to server
		const messageObject = {
			room: room_id,
			username: gameUsername,
			timestamp: Date.now(),
			content: message,
		}
		// emit chat message to server
		socket.emit('chat:message', messageObject)
		// clear message input field
		setMessage('')
	}

	/**
	 * Function to display winner
	 * @param {string} winner username of user that won the game
	 */
	const handleWinner = (winner) => {
		setWinner(winner)
		// Check if winner is true
		if (winner) {
			setWinnerScreen(true)
		}
	}

	// connect to room when component is mounted
	useEffect(() => {
		// if no username, redirect them to the login page
		if (!gameUsername) {
			navigate('/')
			return
		}
		// listen for incoming messages
		socket.on('chat:incoming', handleIncomingMessage)
		// listen for incoming fire event
		socket.on('fire:incoming', handleIncomingFire)
		// listen for new turn
		socket.on('log:fire', handleNewTurn)
		// listen for game instructions
		socket.on('log:instructions', handleIncomingMessage)
		// listen for updated ship status
		socket.on('ships:status', handleShipStatus)
		// listen for when a user disconnects
		socket.on('user:disconnected', handleIncomingMessage)
		// listen for starting player
		socket.on('user:firstTurn', handleStartingPlayer)
		// listen for usernames
		socket.on('users:usernames', handleIncomingUsernames)
		// listen for winner
		socket.on('winner', handleWinner)
		return () => {
			// stop listening to 
			socket.off('chat:incoming', handleIncomingMessage)
			socket.off('fire:incoming', handleIncomingFire)
			socket.off('log:fire', handleNewTurn)
			socket.off('log:instructions', handleIncomingMessage)
			socket.off('ships:status', handleShipStatus)
			socket.off('user:disconnected', handleIncomingMessage)
			socket.off('user:firstTurn', handleStartingPlayer)
			socket.off('users:usernames', handleIncomingUsernames)
			socket.off('winner', handleWinner)
		}
	}, [socket, gameUsername, navigate, handleIncomingUsernames, handleIncomingFire, handleNewTurn, handleShipStatus, handleStartingPlayer])

	return (
		<>
			<ToastContainer className="p-4" position="top-end">
				<Toast className="text-black" show={showToast} onClose={toggleShowToast} delay={3000} autohide>
					<Toast.Header>
						<strong className="me-auto">
							{theme === 'light' ? 'Captain! 🏴‍☠️' : 'Astronaut! 🚀'}
						</strong>
					</Toast.Header>
					<Toast.Body className="p-4"><strong>Stay calm, it's not your turn yet! </strong> </Toast.Body>
				</Toast>
			</ToastContainer>
			<Container fluid>
				{!winnerScreen && (
					<div className="row d-flex align-items-center justify-content-between w-100">
						<div className="col-md-5 d-flex align-items-center justify-content-center">
							<div id="user-gameboard">
								{theme === 'light' ? <h1>🏴‍☠️ Captain </h1> : <h1>🧑🏼‍🚀 Astronaut</h1>}
								<table ref={userTableRef} id="userTable" className="user">
									<caption className="table-title">{gameUsername}
										<br />
										<span className="ships-left"> {theme === 'light' ? 'Ships left: ' : 'Space ships left: '} {remainingShipsLeftside.length}</span></caption>
									<thead>
										<tr>
											<th scope="col">#</th>
											{board.cols.map((letter, index) => (
												<th
													key={index}
													scope="col">
													{letter}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{board.rows.map((number, index) => (
											<tr key={index}>
												<th scope="row">{number}</th>
												{board.cols.map((letter, index) => (
													<td
														key={index}
														id={letter + number}
														className="user"
													>
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<div className="col-md-2 d-flex flex-column justify-content-center">
							<div id="chat-wrapper">
								<div id="chat-log">
									<div id="chat-title" className="text-center p-2 position-sticky">
										{theme === 'light' ? '🏴‍☠️ ACTIVITY LOG 🏴‍☠️' : '🚀 SPACE LOG 🚀'}
									</div>
									<ListGroup id="messages">
										{messages.map((message, index) => {
											const ts = new Date(message.timestamp)
											const time = ts.toLocaleTimeString()
											return (
												<ListGroup.Item key={index} className="message">
													<span className="time">{time} </span>
													<span className="user">{message.username} </span>
													<span className="content">{message.content}</span>
												</ListGroup.Item>
											)
										})}
									</ListGroup>
								</div>
								<Form onSubmit={handleSubmit}>
									<InputGroup>
										<Form.Control
											type='text'
											placeholder='Send message'
											value={message}
											onChange={e => setMessage(e.target.value)}
											required
										/>
										<Button type='submit' disabled={!message.length}>Send</Button>
									</InputGroup>
								</Form>
								{!hideButton && (
									<div id="buttons-wrapper" className='py-3'>
										<Button
											variant='success'
											onClick={handleGenerateShips}
										> Generate
											{theme === 'light' ? ' pirate ships' : ' space ships'}
										</Button>
									</div>
								)}
								{turnMessage &&
									<>
										{myTurn
											? <div className='text-center p-4'>
												<h4>Bombs away!</h4>
												<p>It's your turn to shoot.</p>
											</div>
											: <div className='text-center p-4'>
												<h4>Hold your ground! </h4>
												<p>It's your opponent's turn.</p>
											</div>
										}
									</>
								}
							</div>
						</div>
						<div className="col-md-5 d-flex align-items-center justify-content-center">
							<div id="opponent-gameboard">
								{theme === 'light' ? <h1>⛵️ Enemy </h1> : <h1>👽 Alien </h1>}
								<table ref={opponentTableRef} id="enemyTable">
									<caption className="table-title">{opponent}
										<br />
										<span className="ships-left">
											{theme === 'light' ? 'Ships left: ' : 'Space ships left: '}  {remainingShipsRightside.length}</span></caption>
									<thead>
										<tr>
											<th scope="col">#</th>
											{board.cols.map((letter, index) => (
												<th
													key={index}
													scope="col">
													{letter}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{board.rows.map((number, index) => (
											<tr key={index}>
												<th scope="row">{number}</th>
												{board.cols.map((letter, index) => (
													<td
														key={index}
														id={letter + number}
														className="opponent"
														onClick={checkClick}
													>
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
				{winnerScreen && (
					<div className="vh-100 w-100 d-flex justify-content-center flex-column align-items-center">
						<Image className="p-4" src={VictoryBaby} fluid />
						<h1 className="p-4">The winner is {winner}</h1>
						<Button as={Link} to="/">Play Again</Button>
					</div>
				)}
			</Container>
		</>
	)
}

export default GameRoom
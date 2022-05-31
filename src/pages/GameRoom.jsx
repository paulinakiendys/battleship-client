import { useNavigate, useParams, Link } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Button, Form, InputGroup, ListGroup, Toast, ToastContainer } from 'react-bootstrap'
import { generateUserShips } from '../assets/js/randomize_flotilla'

const GameRoom = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [opponent, setOpponent] = useState('')
    const { room_id } = useParams()
    const { clientID, gameUsername, socket } = useGameContext()
    const navigate = useNavigate()
    const [hideButtons, setHideButtons] = useState(false)
    const [myTurn, setMyTurn] = useState(false)
    const [turnMessage, setShowTurnMessage] = useState(false)
    const [showToast, setShowToast] = useState(false);
    const toggleShowToast = () => setShowToast(!showToast);
    const [remainingShipsLeftside, setRemainingShipsLeftside] = useState([1, 2, 3, 4]);
    const [remainingShipsRightside, setRemainingShipsRightside] = useState([1, 2, 3, 4]);
    const [winner, setWinner] = useState(null);
    const [winnerScreen, setWinnerScreen] = useState(false)

    const userTableRef = useRef()
    const opponentTableRef = useRef()

    const board = {
        "rows": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    }

    /**
     * Function to style boards if it was a 'hit' or a 'miss'
     * 
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

                // check if it was a 'hit' or a 'miss'
                if (hit) {
                    cell.innerText = 'hit'
                } else {
                    cell.innerText = 'miss'
                }
            } else if (gameUsername !== username) {
                // if 'opponent', get user's table
                const userTable = userTableRef.current
                // get cell that was clicked on
                const cell = userTable.querySelector(`#${square}`)

                // check if it was a 'hit' or a 'miss'
                if (hit) {
                    cell.innerText = 'HIT'
                } else {
                    cell.innerText = 'MISS'
                }
            }
        },
        [gameUsername],
    )

    const handleStartingPlayer = useCallback(
        (randomUser) => {
            setShowTurnMessage(true)
            if (randomUser.username === gameUsername) {
                setMyTurn(true)
            }
        },
        [gameUsername],
    )

    const checkClick = (e) => {

        if (myTurn) {
            // console.log("HELLO", e.target)
            let shotFired = e.target.id

            //emit fire
            socket.emit('user:fire', shotFired, room_id, gameUsername)

            socket.on('error', (err) => {
                console.log("err", err)
            })

        } else {
            toggleShowToast()
            console.log("Not your turn")
        }

    }

    const handleNewTurn = useCallback(
        (message, user) => {
            // add message to chat
            setMessages(prevMessages => [...prevMessages, message])

            if (user.username === gameUsername) {
                setMyTurn(false)
            } else {
                setMyTurn(true)
            }
        }, [gameUsername]
    )

    // Update ship status
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

    const handleReadyClick = () => {

        let userShips = generateUserShips()

        const table = userTableRef.current
        if (table.classList.contains("user")) {

            userShips.forEach((ship, index) => {
                for (const row of table.rows) {
                    for (const cell of row.cells) {

                        if (ship.position.includes(cell.id)) {
                            // console.log("Boat")
                            cell.style.backgroundColor = ship.color
                        }
                    }
                }
            })
        }

        // hide buttons
        setHideButtons(true)

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

    const handleIncomingMessage = message => {
        // console.log("Received a new message", message)

        // add message to chat
        setMessages(prevMessages => [...prevMessages, message])
    }

    const handleSubmit = e => {
        e.preventDefault()

        // send message to server
        // 1. construct message object
        const messageObject = {
            room: room_id,
            username: gameUsername,
            timestamp: Date.now(),
            content: message,
        }

        // 2. emit chat message to server
        socket.emit('chat:message', messageObject)

        // clear message input field
        setMessage('')
    }

    const handleWinner = (winner) => {
        setWinner(winner)
        console.log("winner is ", winner)

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


        // listen for usernames
        socket.on('users:usernames', handleIncomingUsernames)

        // listen for when a user disconnects
        socket.on('user:disconnected', handleIncomingMessage)

        // listen for game instructions
        socket.on('log:instructions', handleIncomingMessage)

        // listen for shot / new turn
        socket.on('log:fire', handleNewTurn)

        // listen for incoming messages
        socket.on('chat:incoming', handleIncomingMessage)

        // listen for starting player
        socket.on('user:firstTurn', handleStartingPlayer)

        // listen for updated ship status
        socket.on('ships:status', handleShipStatus)

        socket.on('winner', handleWinner)

        // listen for incoming fire event
        socket.on('fire:incoming', handleIncomingFire)

        return () => {
            console.log("Running cleanup")

            // stop listening to events
            socket.off('users:usernames', handleIncomingUsernames)
            socket.off('user:disconnected', handleIncomingMessage)
            socket.off('chat:incoming', handleIncomingMessage)
            socket.off('log:instructions', handleIncomingMessage)
            socket.off('log:fire', handleIncomingMessage)
            socket.off('user:firstTurn', handleStartingPlayer)
            socket.off('log:fire', handleNewTurn)
            socket.off('ships:status', handleShipStatus)
            socket.off('fire:incoming', handleIncomingFire)
        }

    }, [socket, gameUsername, navigate, handleIncomingUsernames, handleIncomingFire, handleNewTurn, handleShipStatus, handleStartingPlayer])

    return (
        <>
            <ToastContainer position="top-end">
                <Toast show={showToast} onClose={toggleShowToast} delay={2000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Captain!</strong>
                    </Toast.Header>
                    <Toast.Body>Stay calm, it's not your turn yet 🛳</Toast.Body>
                </Toast>
            </ToastContainer>

            {!winnerScreen && (
                <div className="row d-flex align-items-center">
                    <div className="col-md-5">
                        <div id="user-gameboard">
                            {/* <GameBoard
                                owner="user"
                                title={gameUsername}
                                shipsleft={remainingShipsLeftside.length}
                            /> */}
                            <table ref={userTableRef} id="userTable" className="user">
                                <caption className="table-title">{gameUsername} <span className="ships-left"> ships left: {remainingShipsLeftside.length}</span></caption>
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
                                                    {/* {letter + number} */}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-md-2 d-flex justify-content-center">
                        {/* <ActivityLog /> */}
                        {/* @todo: make ChatLog a component */}
                        <div id="chat-wrapper">
                            <div id="chat-log">
                                {/* Here is log/chat */}
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
                                    }
                                    )}
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
                            {!hideButtons && (
                                <div id="buttons-wrapper" className='py-3'>
                                    {/* <Button
                                    variant='warning'
                                    onClick={handleRandomizeClick}
                                >
                                    Randomize
                                </Button> */}
                                    <Button
                                        variant='success'
                                        onClick={handleReadyClick}
                                    >
                                        Generate ships
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div id="opponent-gameboard">
                            {/* <EnemyBoard
                                owner="opponent"
                                title={opponent}
                                check={checkClick}
                                shipsleft={remainingShipsRightside.length}
                            /> */}
                            <table ref={opponentTableRef} id="enemyTable">
                                <caption className="table-title">{opponent} <span className="ships-left"> ships left: {remainingShipsRightside.length}</span></caption>
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
                                                    {/* {letter + number} */}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {turnMessage &&
                        <>
                            {myTurn
                                ? <h1 className='text-center'>Your turn</h1>
                                : <h1 className='text-center'>Opponent's turn</h1>
                            }
                        </>
                    }
                </div>
            )}

            {winnerScreen && (
                <div className="vh-100 d-flex justify-content-center flex-column align-items-center">
                    {/* @todo Add styling to winner screen */}
                    <h1>The winner is {winner}</h1>
                    <Button as={Link} to="/">Play Again</Button>
                </div>
            )}
        </>
    )
}

export default GameRoom
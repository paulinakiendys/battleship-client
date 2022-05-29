import { useNavigate, useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import GameBoard from '../components/GameBoard'
import EnemyBoard from '../components/EnemyBoard'
import { useEffect, useState, useCallback } from 'react'
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

    // const handleRandomizeClick = () => {
    //     console.log("You clicked me!")
    //     /**
    //      * @todo Tirapat: call function to randomly place ships
    //      */
    // }

    const handleStartingPlayer = (randomUser) => {
        setShowTurnMessage(true)
        if (randomUser.username === gameUsername) {
            setMyTurn(true)
        }
    }

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

    const handleNewTurn = (message, user) => {
        // console.log("Received a new message", message)

        // add message to chat
        setMessages(prevMessages => [...prevMessages, message])

        if (user.username === gameUsername) {
            setMyTurn(false)
        } else {
            setMyTurn(true)
        }

        // console.log("My turn is: ", myTurn)
    }

    // Update ship status
    const handleShipStatus = (playerOneRemainingShips, playerOneID, playerTwoRemainingShips, playerTwoID) => {
        if (clientID === playerOneID) {
            setRemainingShipsLeftside(playerOneRemainingShips)
            setRemainingShipsRightside(playerTwoRemainingShips)
        } else if (clientID === playerTwoID) {
            setRemainingShipsLeftside(playerTwoRemainingShips)
            setRemainingShipsRightside(playerOneRemainingShips)
        }
    }

    const handleReadyClick = () => {

        let userShips = generateUserShips()

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
        setMessages(prevMessages => [message, ...prevMessages])
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
        // console.log("winner is ", winner)
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
        }

    }, [socket, gameUsername, navigate, handleIncomingUsernames])

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

            <div className="row d-flex align-items-center">
                <div className="col-md-5">
                    <div id="user-gameboard">
                        <GameBoard
                            owner="user"
                            title={gameUsername}
                            shipsleft={remainingShipsLeftside.length}
                        />
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
                                    Ready
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-5">
                    <div id="opponent-gameboard">
                        <EnemyBoard
                            owner="opponent"
                            title={opponent}
                            check={checkClick}
                            shipsleft={remainingShipsRightside.length}
                        />
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
        </>
    )
}

export default GameRoom
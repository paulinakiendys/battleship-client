import { useNavigate, useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { GameBoard } from '../components/GameBoard'
import EnemyBoard from '../components/EnemyBoard'
import ActivityLog from '../components/ActivityLog'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap'

const GameRoom = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [opponent, setOpponent] = useState('')
    const { room_id } = useParams()
    const { gameUsername, socket } = useGameContext()
    const navigate = useNavigate()
    const [hideButtons, setHideButtons] = useState(false)

    const handleRandomizeClick = () => {
        console.log("You clicked me!")
        /**
         * @todo Tirapat: call function to randomly place ships
         */
    }

    const handleReadyClick = () => {

        let userShips = {   
            shipId: 1,
            length: 4,
            row: "",
            col: "",
            position: [],
            color: "green",
            sunk: false
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

                //TODO Send the userships to the server
                let userShips = ['test', 'test']
                socket.emit('ships:ready', room_id, userShips)
            }
        })
    }

    const handleIncomingUsernames = (userOne, userTwo) => {
        if (gameUsername === userOne) {
            setOpponent(userTwo)
        } else {
            setOpponent(userOne)
        }
    }

    const handleIncomingMessage = message => {
        console.log("Received a new message", message)

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

        // listen for game instructions
        socket.on('log:fire', handleIncomingMessage)

        // listen for incoming messages
        socket.on('chat:incoming', handleIncomingMessage)

        socket.on('log:startingPlayer', handleIncomingMessage)

        return () => {
            console.log("Running cleanup")

            // stop listening to events
            socket.off('users:usernames', handleIncomingUsernames)
            socket.off('user:disconnected', handleIncomingMessage)
            socket.off('chat:incoming', handleIncomingMessage)
            socket.off('log:instructions', handleIncomingMessage)
            socket.off('log:startingPlayer', handleIncomingMessage)
        }

    }, [socket, gameUsername, navigate])

    return (
        <>
            <div className="row d-flex align-items-center">
                <div className="col-md-5">
                    <div id="user-gameboard">
                        <GameBoard
                            owner="user"
                            title={gameUsername}
                        />
                        <p className="text-center">Ships left: <span id="opponents-ships"></span></p>
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
                            <div id="buttons-wrapper">
                                <Button
                                    variant='warning'
                                    onClick={handleRandomizeClick}
                                >
                                    Randomize
                                </Button>
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
                        />
                        <p className="text-center">Ships left: <span id="opponents-ships"></span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GameRoom
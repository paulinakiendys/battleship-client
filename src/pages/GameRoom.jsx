import { useNavigate, useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import GameBoard from '../components/GameBoard'
import ActivityLog from '../components/ActivityLog'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap'

const GameRoom = () => {
<<<<<<< HEAD
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { room_id } = useParams()
    const { gameUsername, socket } = useGameContext()
    const navigate = useNavigate()
=======
    const { room_id, gameUsername } = useParams()
    const [opponentDisconnected, setOpponentDisconnected] = useState(false)
    const { socket } = useGameContext()
>>>>>>> feature-hh-design

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

        // listen for when a user disconnects
        socket.on('user:disconnected', handleIncomingMessage)

        // listen for incoming messages
        socket.on('chat:incoming', handleIncomingMessage)

        return () => {
            console.log("Running cleanup")

            // stop listening to events
            socket.off('chat:incoming', handleIncomingMessage)
            socket.off('user:disconnected', handleIncomingMessage)
        }

    }, [socket, gameUsername, navigate])

    return (
        <>
            <h1>{room_id}</h1>
            <div id="game-wrapper">
                <div id="board-wrapper">
                    <h2>Your Battleships</h2>
                    <h3>Ships remaining: <span>3</span></h3>
                    <div id="board">
                        {/* Here is user's board */}
                    </div>
                </div>
                <div id="chat-wrapper">
                    <div id="chat">
                        {/* Here is log/chat */}
                        <ListGroup id="messages">
                            {messages.map((message, index) => {
                                const ts = new Date(message.timestamp)
                                const time = ts.toLocaleTimeString()
                                return (
                                    <ListGroup.Item key={index} className="message">
                                        <span className="time">{time} </span>
                                        {/* <span className="user">{message.username}:</span> */}
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
                    <div id="buttons-wrapper">
                        <Button variant='warning'>Randomize</Button>
                        <Button variant='success'>Ready</Button>
                    </div>
                </div>
                <div id="board-wrapper">
                    <h2>Opponent's Battleships</h2>
                    <h3>Ships remaining: <span>4</span></h3>
                    <div id="board">
                        {/* Here is opponent's board */}
                    </div>
                </div>
            </div>
            <div className="row d-flex align-items-center">
                <div className="col-md-5">
                    <div id="user-gameboard">
                        <GameBoard 
                            owner="user"
                            title= {gameUsername}
                        />
                        <p className="text-center">Ships left: <span id="opponents-ships"></span></p>
                    </div>
                </div>

                <div className="col-md-2 d-flex justify-content-center">
                    <ActivityLog />
                </div>

                <div className="col-md-5">
                    <div id="opponent-gameboard">
                        <GameBoard 
                            owner="opponent"
                            title="Opponent" 
                        />
                        <p className="text-center">Ships left: <span id="opponents-ships"></span></p>
                    </div>
                </div>
            </div>

            <h1>Game room: {room_id}</h1>
            {opponentDisconnected && (<p>Your opponent left the battle 😥</p>)}
        </>
    )
}

export default GameRoom
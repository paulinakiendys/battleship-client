import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

const GameRoom = () => {
    const { room_id } = useParams()
    const [opponentDisconnected, setOpponentDisconnected] = useState(false)
    const { socket } = useGameContext()

    useEffect(() => {
        // listen for when a user disconnects
        socket.on('user:disconnected', () => {
            setOpponentDisconnected(true)
        })
    }, [socket])

    return (
        <>
            <h1>{room_id}</h1>
            {opponentDisconnected && (<p>Your opponent left the battle 😥</p>)}
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
                        <ul id="messages">
                            <li>Blabla</li>
                            <li>Blabla</li>
                            <li>Blabla</li>
                        </ul>
                    </div>
                    <Form>
                        <InputGroup>
                            <Form.Control type='text' />
                            <Button type='submit'>Send</Button>
                        </InputGroup>
                    </Form>
                    <div id="buttons-wrapper">
                        <Button variant='warning'>Change</Button>
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
        </>
    )
}

export default GameRoom
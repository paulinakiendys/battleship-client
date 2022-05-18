import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { useEffect, useState } from 'react'

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
            <h1>Game room: {room_id}</h1>
            {opponentDisconnected && (<p>Your opponent left the battle 😥</p>)}
        </>
    )
}

export default GameRoom
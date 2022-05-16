import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'

const GameRoom = () => {
    const { room_id } = useParams()
    const { socket } = useGameContext()

    // connect to room when component is mounted
    useEffect(() => {
        // emit join request
        socket.emit('user:joined', room_id, status => {
            console.log(`Successfully joined ${room_id}`, status)
        })
    }, [socket, room_id])

    return (
        <>
            <h1>Game room: {room_id}</h1>
        </>
    )
}

export default GameRoom
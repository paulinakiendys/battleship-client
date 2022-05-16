import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'

const GameRoom = () => {
    const { room_id } = useParams()
    const { socket } = useGameContext()
    const [users, setUsers] = useState([])

    const handleUpdateUsers = userlist => {
        console.log("Got new userlist", userlist)
        setUsers(userlist)
    }

    // connect to room when component is mounted

    /**
     * @todo fix bug: join request emitted twice
     */
    useEffect(() => {
        // emit join request
        socket.emit('user:joined', room_id, status => {
            console.log(`Successfully joined ${room_id}`, status)
            
        })

        // listen for updated userlist
        socket.on('user:list', handleUpdateUsers)

    }, [socket, room_id])

    return (
        <>
            <h1>Game room: {room_id}</h1>
            <div id="users">
                <h2>Users</h2>
                <ul id="online-users">
                    {Object.values(users).map((user, index) =>
                        <li key={index}>{user} connected</li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default GameRoom
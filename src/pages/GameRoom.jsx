import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'

const GameRoom = () => {
    const { room_id } = useParams()
    const { gameUsername, socket } = useGameContext()
    const [users, setUsers] = useState([])
    const [connected, setConnected] = useState(false)
    const navigate = useNavigate()

    const handleUpdateUsers = userlist => {
        console.log("Got new userlist", userlist)
        setUsers(userlist)
    }

    // connect to room when component is mounted
    useEffect(() => {
        // if no username, redirect user to the login page
        if (!gameUsername) {
            navigate('/')
            return
        }

        // listen for updated userlist
        socket.on('user:list', handleUpdateUsers)

    }, [socket, room_id, gameUsername, navigate])

    // display connecting message
    if (!connected) {
        return (
            <p>Stand by, connecting....</p>
        )
    }

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
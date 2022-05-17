import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import GameBoard from '../components/GameBoard'
import ActivityLog from '../components/ActivityLog'

const GameRoom = () => {
    const { room_id } = useParams()
    const { gameUsername, socket } = useGameContext()
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    const handleUpdateUsers = userlist => {
        console.log("Got new userlist", userlist)
        setUsers(userlist)
    }

    // connect to room when component is mounted

    /**
     * @todo fix bug: join request emitted twice
     */
    useEffect(() => {
        // if no username, redirect user to the login page
        if (!gameUsername) {
            navigate('/')
            return
        }

        // emit join request
        socket.emit('user:joined', gameUsername, room_id, status => {
            console.log(`Successfully joined ${room_id} as ${gameUsername}`, status)

        })

        // listen for updated userlist
        socket.on('user:list', handleUpdateUsers)

    }, [socket, room_id, gameUsername, navigate])

    console.log("Users:", users)
    console.log("Game username:", gameUsername)

    return (
        <>
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
                            title="Opponent's field" 
                        />
                        <p className="text-center">Ships left: <span id="opponents-ships"></span></p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default GameRoom
import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import GameBoard from '../components/GameBoard'
import ActivityLog from '../components/ActivityLog'
import { useEffect, useState } from 'react'

const GameRoom = () => {
    const { room_id } = useParams()
    const [opponentDisconnected, setOpponentDisconnected] = useState(false)
    const { socket, gameUsername } = useGameContext()

    useEffect(() => {
        // listen for when a user disconnects
        socket.on('user:disconnected', () => {
            setOpponentDisconnected(true)
        })
    }, [socket])

    // console.log("Users:", users)
    // console.log("Game username:", gameUsername)

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
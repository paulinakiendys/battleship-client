import { useParams } from 'react-router-dom'
const GameRoom = () => {
    const { room_id } = useParams()
	return (
		<>
			<h1>Game room: {room_id}</h1>
		</>
	)
}

export default GameRoom
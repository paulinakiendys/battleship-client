import { useGameContext } from "../contexts/GameContextProvider"
import { Button } from 'react-bootstrap'

const HomePage = () => {
	const { socket } = useGameContext()

	const handleStartGameClick = () => {
		// Add code here
	}
	return (
		<>
			<h1>Welcome to Battleship!</h1>
			<Button onClick={handleStartGameClick}>Start Game</Button>
		</>
	)
}

export default HomePage
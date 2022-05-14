import { useGameContext } from "../contexts/GameContextProvider"

const HomePage = () => {
	const { socket } = useGameContext()

	return (
		<>
			<h1>Welcome to Battleship!</h1>
		</>
	)
}

export default HomePage
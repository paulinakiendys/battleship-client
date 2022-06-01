import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import RulesModal from '../components/RulesModal'
import { useThemeContext } from '../contexts/ThemeContextProvider'

const Navigation = () => {
	const { isSpaceTheme, toggleTheme } = useThemeContext()

	return (
		<Navbar bg="transparent" expand="md">
			<Container>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto d-flex align-items-center">
						<Button id="theme-btn" onClick={toggleTheme} variant="light">
							{isSpaceTheme() ? '🏴‍☠️' : '🚀'}
						</Button>
						<RulesModal />
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default Navigation
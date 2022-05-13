// import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
// import Nav from 'react-bootstrap/Nav'
import { Link, /*NavLink*/ } from 'react-router-dom'

const Navigation = () => {
	return (
		<Navbar bg="dark" variant="dark" expand="md">
			<Container>
				<Navbar.Brand as={Link} to="/">React Chat</Navbar.Brand>

				{/*
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<Nav.Link as={NavLink} end to="/fetch">Fetch</Nav.Link>
						<Nav.Link as={NavLink} end to="/search">Search</Nav.Link>
						<Button onClick={toggleTheme} variant="outline-secondary">
							{isDarkTheme() ? '☀️' : '🌙'}
						</Button>
					</Nav>
				</Navbar.Collapse>
				*/}
			</Container>
		</Navbar>
	)
}

export default Navigation

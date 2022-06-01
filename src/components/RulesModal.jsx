import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function RulesModal() {
    //variables for modal
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

    return (
            <div className="d-flex justify-content-end p-3">
				<Button className="rounded-circle" variant="light" onClick={handleShow}>
					?
				</Button>

				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title><h1>How to play?</h1></Modal.Title>
					</Modal.Header>
					<Modal.Body>The rules are simple. Seek out your opponent's ships and destroy them. Click on a square to fire. Sink all your opponent's ships to win!</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
    )
}

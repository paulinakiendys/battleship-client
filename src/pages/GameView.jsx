import GameBoard from '../components/GameBoard'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'


export default function GameView() {

    //variables for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        <div className="d-flex justify-content-end">
        <Button className="rounded-circle" variant="secondary" onClick={handleShow}>
            ?
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Battleship 🛳 </Modal.Title>
            </Modal.Header>
            <Modal.Body>The rules are simple. Guess where your opponents have their boats, click on a square to fire. Sink all your opponent's ships to win!</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
        

        <div className="d-flex align-items-center justify-content-center">
            <div id="user-gameboard">
                <GameBoard 
                    owner="user"
                    title="Your field"
                />
            </div>
            
            <div id="opponent-gameboard">
                <GameBoard 
                    owner="opponent"
                    title="Opponent's field" 
                />
            </div>
        </div>
        </>
        
    )
}

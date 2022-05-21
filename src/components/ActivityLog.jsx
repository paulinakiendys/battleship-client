import { Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

export default function ActivityLog() {
    const { room_id } = useParams()

    return (
        <>
       <Card className="activity-log bg-light">
        <Card.Body>
            <Card.Title>🛳 Activity log</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Game room: {room_id}</Card.Subtitle>
            <Card.Text id="activities">
            {/* Place activities here*/ }
            </Card.Text>
        </Card.Body>
        </Card>
        </>
    )
}

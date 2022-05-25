import { useGameContext } from '../contexts/GameContextProvider'
import { useParams } from 'react-router-dom'

let shotFired;

export default function EnemyBoard(props) {
  const { room_id } = useParams()
  const { gameUsername, socket } = useGameContext()

  const board = {
    "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  }

  console.log("ROOM ID:", room_id)

    // Send ID of the cell the user clicked on to fire
  
   
    return (
      <table id="enemyTable">
        <caption className="table-title">{props.title}</caption>
            <tbody>
            {board.rows.map(row => (
              <tr key={row}>
                {board.rows.map(col => (
                  <td className={props.owner} onClick={props.check} id={board.cols[col] + board.rows[row]} key={board.rows[row] + board.cols[col]}>{board.rows[row] + board.cols[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    )
}

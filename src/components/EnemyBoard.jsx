import { useGameContext } from '../contexts/GameContextProvider'
import { useParams } from 'react-router-dom'

let shotFired;

export default function EnemyBoard({ owner, title, check }) {
  const { room_id } = useParams()
  const { gameUsername, socket } = useGameContext()

  const board = {
    "rows": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  }

  console.log("ROOM ID:", room_id)

  // Send ID of the cell the user clicked on to fire

  return (
    <>
      <table id="enemyTable">
        <caption className="table-title">{title}</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            {board.cols.map((letter, index) => (
              <th
                key={index}
                scope="col">
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {board.rows.map((number, index) => (
            <tr key={index}>
              <th scope="row">{number}</th>
              {board.cols.map((letter, index) => (
                <td
                  key={index}
                  id={number + letter}
                  className={owner}
                  onClick={check}
                >
                  {/* {letter + number} */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

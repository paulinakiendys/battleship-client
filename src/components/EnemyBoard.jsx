import {socket} from '../contexts/GameContextProvider'

let shotFired = -1;

export default function GameBoard(props) {

  const board = {
    "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  }

    // Send ID of the cell the user clicked on to fire
  const checkClick = (e) => {
      console.log(e.target)
      shotFired = e.target.id
      socket.emit('fire', shotFired)
      console.log("shotFired", shotFired)

      socket.on('error', (err) => {
        console.log("err",err)
      })
  }
   
  return (
    <table id="enemyTable">
      <caption className="table-title">{props.title}</caption>
          <tbody>
          {board.rows.map(row => (
            <tr key={row}>
              {board.rows.map(col => (
                <td className={props.owner} onClick={checkClick} id={board.rows[row] + board.cols[col]} key={board.rows[row] + board.cols[col]}>{board.rows[row] + board.cols[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
    </table>
  )
}

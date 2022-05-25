
export default function GameBoard(props) {

  const board = {
      "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  }
   
    return (
      <table id="enemyTable">
        <caption className="table-title">{props.title}</caption>
            <tbody>
            {board.rows.map(row => (
              <tr key={row}>
                {board.rows.map(col => (
                  <td className={props.owner} id={board.rows[row] + board.cols[col]} key={board.rows[row] + board.cols[col]}>{board.rows[row] + board.cols[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    )
}

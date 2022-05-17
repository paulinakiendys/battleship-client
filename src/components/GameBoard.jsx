export default function GameBoard(props) {
    const board = {
        "cols": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    }

    const testCode = (e) => {
        console.log("Testing: ", e.target.id)
        console.log(e.target)
        e.target.innerHTML = ""
        e.target.classList.add("strike");
      }

      //Aktivitetslogg

      console.log("Testing:", board.cols[1] + board.rows[1])
    
    return (

      <>
        <table className="d-flex align-items-center flex-column">
        <caption className="table-title">{props.title}</caption>
            <tbody>
            {board.rows.map(row => (
              <tr key={row}>
                {board.rows.map((col, index) => (
                  <td className={props.owner} onClick={testCode} id={board.rows[index] + board.cols[index]} key={board.rows[index] + board.cols[index]}></td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
      
      </>

     
    )
}

export default function GameBoard(props) {

    const board = {
        "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    }

    const testCode = (e) => {
        console.log("Testing: ", e.target.id)
        console.log(e.target)
        e.target.innerHTML = ""
        e.target.classList.add("strike")
    }

     // Jag tror BACKEND ska checka detta // Man kan lagra båda spelarna skepp lista i servern sen kollar servern om någon av skeppen har träffats skickar det till klienten där klienten endast visar hit or miss. 
  /*   const checkClick = (e) => {

      console.log("check", e.target.id)

      if(opponentShips.includes(e.target.id)) {
        checkHit(e.target.id, true);

      } else if(!opponentShips.includes(e.target.id)) {
        checkHit(e.target.id, false);
      }
    } 
       const checkHit = (id ,clicked) => {
      if(clicked) {
        console.log("you hit!")
        // Change background color that shows HIT and make this square unclickable
      } else if(!clicked) {
        console.log("you missed!")
        // Change background color that shows MISS and make this square unclickable
      }
    }
    */
   
    return (
      <table id="userTable">
        <caption className="table-title">{props.title}</caption>
            <tbody>
            {board.rows.map(row => (
              <tr key={row}>
                {board.rows.map(col => (
                  <td className={props.owner} onClick={testCode} id={board.rows[row] + board.cols[col]} key={board.rows[row] + board.cols[col]}>{board.rows[row] + board.cols[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    )
}

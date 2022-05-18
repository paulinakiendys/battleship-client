//  Testing code if it works :) Temporary placement 
import generateRandomLocation from '../assets/js/randomize_flotilla'

// List of Ships
const shipArray = [
  {   
      shipName: "Carrier",
      length: 4,
      row: "",
      col: ""
  },
  {
      shipName: "Battleship",
      length: 3,
      row: "",
      col: ""
  },
  {
      shipName: "Cruiser",
      length: 2,
      row: "",
      col: ""
  },
  {
      shipName: "Submarine",
      length: 2,
      row: "",
      col: ""
  }
]
// forEach object run generateRandomLocation
shipArray.forEach(ship => generateRandomLocation(ship))
// Console.log it to see if it works :D 
shipArray.forEach(ship => console.log("shipArray", ship)) 


export default function GameBoard(props) {
    const board = {
        "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    }

    const testCode = (e) => {
        console.log("Testing: ", e.target.id)
        console.log(e.target)
        e.target.innerHTML = ""
        e.target.classList.add("strike");
      }
    
    return (
      <table>
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

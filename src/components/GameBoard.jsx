import generateRandomLocation from '../assets/js/randomize_flotilla'

let opponentShips = []
let userShip = []

export default function GameBoard(props) {

    const board = {
        "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    }
    // List of Ships
    const shipsArray = [
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
      shipsArray.forEach(ship => {generateRandomLocation(ship)})

      shipsArray.forEach( (ship) => {
      console.log("Ship Name:", ship.shipName, "row", ship.row, "col", ship.col)})

    const testCode = (e) => {
        console.log("Testing: ", e.target.id)
        console.log(e.target)
        e.target.innerHTML = ""
        e.target.classList.add("strike");
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

    // Check if the clicked square contains ship, then use checkHit function to check hit or miss
    // TODO: Place the ships out on grid(somehow idk :( ))
    const checkClick = (e) => {

      console.log("check", e.target.id)

      if(opponentShips.includes(e.target.id)) {
        checkHit(e.target.id, true);

      } else if(!opponentShips.includes(e.target.id)) {
        checkHit(e.target.id, false);
      }
    }
    // Man ska inte kunna clicka på sin spelplan, endast motståndaren
    return (
      <table>
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

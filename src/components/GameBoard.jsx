
import {generateRandomLocation, getAllCells} from '../assets/js/randomize_flotilla'

let userShips = []
let position = []

// List of Ships
 const shipsArray = [
  {   
      shipId: 1,
      length: 4,
      row: "",
      col: "",
      position: []
  },
  {   
      shipId: 2,
      length: 3,
      row: "",
      col: "",
      position: []
  },
  {   
      shipId: 3,
      length: 2,
      row: "",
      col: "",
      position: []
  },
  { 
      shipId: 4,
      length: 2,
      row: "",
      col: "",
      
  }
]


// Give user a list of ships 
userShips = shipsArray.concat(userShips)
userShips.forEach(ship => {generateRandomLocation(ship)
  
  // Titta mer på detta
 /*  for(let i = ship.row + ship.col; i < ship.row + ship.col + ship.length; i++) {
    ship.position.push(i)
  } */
})
console.log("userShips", userShips)

// Check for duplicates
const lookup = userShips.reduce((a, e) => {
  a[e.row] = ++a[e.row] || 0;
  return a;
}, {});
console.log("Checking duplicates",userShips.filter(e => lookup[e.row]));


// Testing index 0 in userShips array
shipsArray[0].position.push([shipsArray[0].col + shipsArray[0].row, shipsArray[0].col + (shipsArray[0].row + 1)])
console.log("shipOne", shipsArray[0])

// TODO: Based on ship length get the rest of the coordinates 

// TODO: Check if the whole ship is inside of board based on length from startingPos(row + col)


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

    // Man ska inte kunna clicka på sin spelplan, endast motståndaren
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
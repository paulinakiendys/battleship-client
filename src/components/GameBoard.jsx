
import {generateRandomLocation, getAllCells} from '../assets/js/randomize_flotilla'
import { useState, useRef, useEffect } from "react"
import { random} from '../pages/GameRoom'

let userShips = []


// List of Ships
 const shipsArray = [
  {   
      shipId: 1,
      length: 4,
      row: "",
      col: "",
      position: [],
      color: "green",
      sunk: false
  },
  {   
      shipId: 2,
      length: 3,
      row: "",
      col: "",
      position: [],
      color: "red", 
      sunk: false,
  },
  {   
      shipId: 3,
      length: 2,
      row: "",
      col: "",
      position: [],
      color: "blue",
      sunk: false,
  },
  { 
      shipId: 4,
      length: 2,
      row: "",
      col: "",
      position: [],
      color: "orange",
      sunk: false,
      
  }
]


// Give user a list of ships 
userShips = shipsArray.concat(userShips)
userShips.forEach(ship => {generateRandomLocation(ship)
  
  // Titta mer på detta
  /* for(let i = ship.row + ship.col; i < ship.row + ship.col + ship.length; i++) {
    ship.position.push(i)
  } */

})

console.log("userShips", userShips)

// Förbätra om har tid
// ShipId 1
if(userShips[0].row >= 5) {
  console.log("Going minus")
  shipsArray[0].position = ([shipsArray[0].col + shipsArray[0].row, shipsArray[0].col + (shipsArray[0].row - 1), shipsArray[0].col + (shipsArray[0].row - 2), shipsArray[0].col + (shipsArray[0].row - 3)])
} else {
  shipsArray[0].position = ([shipsArray[0].col + shipsArray[0].row, shipsArray[0].col + (shipsArray[0].row + 1), shipsArray[0].col + (shipsArray[0].row + 2), shipsArray[0].col + (shipsArray[0].row + 3)])
}
// ShipId 2
if(userShips[1].row >= 5) {
  console.log("Going minus")
  shipsArray[1].position = ([shipsArray[1].col + shipsArray[1].row, shipsArray[1].col + (shipsArray[1].row - 1), shipsArray[1].col + (shipsArray[1].row - 2)])
} else {
  shipsArray[1].position = ([shipsArray[1].col + shipsArray[1].row, shipsArray[1].col + (shipsArray[1].row + 1), shipsArray[1].col + (shipsArray[1].row + 2)])
}
// ShipId 3
if(userShips[2].row >= 5) {
  console.log("Going minus")
  shipsArray[2].position = ([shipsArray[2].col + shipsArray[2].row, shipsArray[2].col + (shipsArray[2].row - 1)])
} else {
  shipsArray[2].position = ([shipsArray[2].col + shipsArray[2].row, shipsArray[2].col + (shipsArray[2].row + 1)])
}
// ShipId 4
if(userShips[3].row >= 5) {
  console.log("Going minus")
  shipsArray[3].position = ([shipsArray[3].col + shipsArray[3].row, shipsArray[3].col + (shipsArray[3].row - 1)])
} else {
  shipsArray[3].position = ([shipsArray[3].col + shipsArray[3].row, shipsArray[3].col + (shipsArray[3].row + 1)])
}



export default function GameBoard(props) {

    const ref = useRef(null)
    const board = {
        "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    }

    useEffect(() => {
      const table = ref.current
     if (table.classList.contains("user")) {
        
      userShips.forEach((ship, index) => {
        for (const row of table.rows) {  
          for (const cell of row.cells) {   

            if(ship.position.includes(cell.id)) {
              console.log("Boat")
              cell.style.backgroundColor = ship.color
            } else {
              console.log(cell.innerText) 
            }
          }
        }
          
        })

     } 
      
    }, [])


    // Man ska inte kunna clicka på sin spelplan, endast motståndaren
    return (
      <table ref={ref} id="userTable" className={props.owner}>
        <caption className="table-title">{props.title}</caption>
            <tbody>
            {board.rows.map(row => (
              <tr key={row}>

                {board.rows.map(col => (
                  <td 
                    className={props.owner}
                    id={board.cols[col] + board.rows[row]} 
                    key={board.rows[row] + board.cols[col]}>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    )
}
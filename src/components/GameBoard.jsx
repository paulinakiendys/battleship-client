import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { useState, useRef, useEffect } from "react"

export default function GameBoard({ owner, title, shipsleft }) {

  const { room_id } = useParams()
  const { gameUsername, socket } = useGameContext()

  const ref = useRef(null)
  const board = {
    "rows": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  }

  //TODO -- Generera bordet EFTER att vi tagit emot userShipList?

  const generateGameBoard = (userShipList) => {
    console.log("is it working? ", userShipList)
  }

  socket.on('user:ships', generateGameBoard)

  // useEffect(() => {
  //   const table = ref.current
  //  if (table.classList.contains("user")) {

  //   userShips.forEach((ship, index) => {
  //     for (const row of table.rows) {  
  //       for (const cell of row.cells) {   

  //         if(ship.position.includes(cell.id)) {
  //           console.log("Boat")
  //           cell.style.backgroundColor = ship.color
  //         } 
  //       }
  //     }

  //     })

  //  } 

  // })


  // Man ska inte kunna clicka på sin spelplan, endast motståndaren
  /*  const testCode = (e) => {
       console.log("Testing: ", e.target.id)
       console.log(e.target)
       e.target.innerHTML = ""
       e.target.classList.add("strike")
   } */

  return (
    <>
      <table ref={ref} id="userTable" className={owner}>
        <caption className="table-title">{title} <span className="ships-left"> ships left: {shipsleft}</span></caption>
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
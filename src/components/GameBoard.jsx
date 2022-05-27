import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import { useState, useRef, useEffect } from "react"


export default function GameBoard(props) {

    const { room_id } = useParams()
    const { gameUsername, socket } = useGameContext()

    const ref = useRef(null)
    const board = {
        "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
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
   
    return (
      <table ref={ref} id="userTable" className={props.owner}>
        <caption className="table-title">{props.title} <span className="ships-left"> ships left: {props.shipsleft}</span></caption>
            <tbody>
            {board.rows.map(row => (
              <tr key={row}>
                {board.rows.map(col => (
                  <td className={props.owner}id={board.rows[row] + board.cols[col]} key={board.rows[row] + board.cols[col]}>{board.rows[row] + board.cols[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    )
}

const board = {
    "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
}

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}

export const generateRandomLocation = (ship) => {
    shuffle(board.rows)
    shuffle(board.cols)
    let randomize = Math.floor(board.cols.length * Math.random());
    
    let randomRow = board.rows[randomize]
    let randomCol = board.cols[randomize]

    board.cols.splice(randomize, 1)
    board.rows.splice(randomize, 1)

    ship.row = randomRow
    ship.col = randomCol

}

export const generateUserShips = () => {

    let userShips = []


    // List of Ships
    const shipsArray = [
      {   
          shipId: 1,
          length: 4,
          row: "",
          col: "",
          position: "",
          color: "green",
          sunk: false
      },
      {   
          shipId: 2,
          length: 3,
          row: "",
          col: "",
          position: "",
          color: "red", 
          sunk: false,
      },
      {   
          shipId: 3,
          length: 2,
          row: "",
          col: "",
          position: "",
          color: "blue",
          sunk: false,
      },
      { 
          shipId: 4,
          length: 2,
          row: "",
          col: "",
          position: "",
          color: "orange",
          sunk: false,
          
      }
    ]


    // Give user a list of ships 
    userShips = shipsArray.concat(userShips)
    userShips.forEach(ship => {generateRandomLocation(ship)
    })

    // ShipId 1
    if(userShips[0].row >= 5) {
      // console.log("Going minus")
      shipsArray[0].position = ([shipsArray[0].col + shipsArray[0].row, shipsArray[0].col + (shipsArray[0].row - 1), shipsArray[0].col + (shipsArray[0].row - 2), shipsArray[0].col + (shipsArray[0].row - 3)])
    } else {
      shipsArray[0].position = ([shipsArray[0].col + shipsArray[0].row, shipsArray[0].col + (shipsArray[0].row + 1), shipsArray[0].col + (shipsArray[0].row + 2), shipsArray[0].col + (shipsArray[0].row + 3)])
    }
    // ShipId 2
    if(userShips[1].row >= 5) {
      // console.log("Going minus")
      shipsArray[1].position = ([shipsArray[1].col + shipsArray[1].row, shipsArray[1].col + (shipsArray[1].row - 1), shipsArray[1].col + (shipsArray[1].row - 2)])
    } else {
      shipsArray[1].position = ([shipsArray[1].col + shipsArray[1].row, shipsArray[1].col + (shipsArray[1].row + 1), shipsArray[1].col + (shipsArray[1].row + 2)])
    }
    // ShipId 3
    if(userShips[2].row >= 5) {
      // console.log("Going minus")
      shipsArray[2].position = ([shipsArray[2].col + shipsArray[2].row, shipsArray[2].col + (shipsArray[2].row - 1)])
    } else {
      shipsArray[2].position = ([shipsArray[2].col + shipsArray[2].row, shipsArray[2].col + (shipsArray[2].row + 1)])
    }
    // ShipId 4
    if(userShips[3].row >= 5) {
      // console.log("Going minus")
      shipsArray[3].position = ([shipsArray[3].col + shipsArray[3].row, shipsArray[3].col + (shipsArray[3].row - 1)])
    } else {
      shipsArray[3].position = ([shipsArray[3].col + shipsArray[3].row, shipsArray[3].col + (shipsArray[3].row + 1)])
    }

return userShips

}


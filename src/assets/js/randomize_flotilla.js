const board = {
    "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
}

    
export const generateRandomLocation = (ship) => {
    let randomize = Math.floor(Math.random() * 10);
    let randomRow = board.rows[randomize]
    let randomCol = board.cols[randomize]

    ship.row = randomRow
    ship.col = randomCol
    
    // Make so that randomRow and randomCol are unique 
  
}

 /**
   * 1 Left
   * 2 Right
   * 3 Up
   * 4: Down
   * Work in progress
*/
/* const generateRandomDirection = () => {
    let randomDirection = Math.floor(Math.random() * 4) +1
} */


export const getAllCells = () => {
    let table = document.getElementById('userTable')
    
    for (let r = 0, n = table.rows.length; r < n; r++) {
    for (let c = 0, m = table.rows[r].cells.length; c < m; c++) {
        console.log("Found", table.rows[r].cells[c])
    }
}
}


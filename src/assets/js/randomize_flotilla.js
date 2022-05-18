
const board = {
    "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
}

const generateRandomLocation = (ship) => {
    let randomize = Math.floor(Math.random() * 10);
    let randomRow = board.rows[randomize]
    let randomCol = board.cols[randomize]
 
    ship.row = randomRow
    ship.col = randomCol

    /**
     * TODO 
     * ship.row and ship.col should be unique for each ship
     * Otherwise run generateRandomLocation until all is unique
     */

}


 /**
   * 1 Left
   * 2 Right
   * 3 Up
   * 4: Down
   * Work in progress
*/
const generateRandomDirection = () => {
    let randomDirection = Math.floor(Math.random() * 4) +1
}


export default generateRandomLocation

const board = {
    "rows": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "cols": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
}

//TODO - Blir inte helt randomized, vi får kolla på hur vi kan optimera den. Alla skeppen hamnar i en diagonal i mitten hehe

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
  


import { useState } from 'react'
import './index.css'
import confetti from 'canvas-confetti';

const TURNS = {
  x: '❌',
  o: '⚪'
}

const Square = ({ children, isSelected, updateBoard, index }) => { //componente, celda

  const ClassName = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className={ClassName}>
      {children}
    </div>
  )
}

function App() {

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  }) //Tablero
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.x
  })
  const [winner, setWinner] = useState(null) //null es q no hay ganador,fall es empate

  const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  const checkWinner = (boardToCheck) => {
    // revisamos todas las combinaciones ganadoras
    // para ver si X u O ganó
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    // si no hay ganador
    return null
  }
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(turn)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    //No actualizamos la posicion si ya tiene algo
    if (board[index] || winner) return

    //Actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    //cambiar el turno
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x
    setTurn(newTurn)

    //Guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    //revisar si hay un ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti({
        particleCount: 300,
        spread: 150
      });
      setWinner(newWinner)

    } else if (checkEndGame(newBoard)) {
      setWinner(false)//Empate
    }
  }
  const checkEndGame = (newBoard) => {
    //Resivamos si hay un empate si no hay mas
    //espacios vacíos en el tablero
    return newBoard.every((square) => square != null)
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset</button>
      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square  /*Cade elemento q renderizo tiene q estar identificado con una key/id */
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn == TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn == TURNS.o}>{TURNS.o}</Square>
      </section>

      {
        winner != null && (
          <section className='winner'>
            <div className='text'>
              <h2>
                {
                  winner === false
                    ? 'Empate'
                    : 'Gano'
                }
              </h2>
              <header className='win'>
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button onClick={resetGame}>Empezar de Nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App

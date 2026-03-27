import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'

function Square({ value, onSquareClick }:
  {
    value: string | null,
    onSquareClick: any
  }
) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ minWidth: "50px", minHeight: "50px" }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onRestart }:
  {
    xIsNext: boolean,
    squares: (string | null)[],
    onPlay: any,
    onRestart: any
  }
) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  return (  
    <>
      <div className="status">{status}</div>
      {[...Array(3)].map((_:any, row: number) => 
        <div className="board-row">
          {[...Array(3)].map((_: any, col: number) =>
            <Square value={squares[3*row + col]} onSquareClick={() => handleClick(3*row + col)} />
          )}
        </div>
      )}
      {winner && <button onClick={onRestart}>Restart?</button>}
    </>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Game() {
  const LOCAL_STORAGE_KEY = "game_state";
  const retrieveGame = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');

  const [history, setHistory] = useState(retrieveGame || [Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(history.length - 1);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_: any, move: number) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    if (move == currentMove) {
      return (
        <p>You are at move #{move}</p>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onRestart={handleRestart}/>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <h1>About</h1>
      <p>React Tutorial to create a Tic-Tac-Toe game.</p>
    </>
  );
}

export default function App() {
  return( 
    <BrowserRouter>
      <nav>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
import { useState } from "react";

type Cell = "empty" | "black" | "white";

export function Othello() {
  const [board, setBoard] = useState<Cell[][]>([
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "black", "white", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "white", "black", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ]);
  const [turn, setTurn] = useState<Cell>("black");

  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== "empty") {
      return;
    }
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = turn;

    // ひっくり返すロジックを実装

    setBoard(newBoard);
    setTurn(turn === "black" ? "white" : "black");
  };

  return (
    <div className="bg-green-700 p-4">
      <div className="grid grid-cols-8 gap-1">
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-16 h-16 border border-gray-300 flex items-center justify-center cursor-pointer
                    ${cell === "black" ? "bg-black rounded-full" : ""}
                    ${cell === "white" ? "bg-white rounded-full" : ""}
                  `}
                onClick={() => handleClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

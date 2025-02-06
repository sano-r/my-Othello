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

  // 石が置ける場所があるか確認
  const canPlaceStone = (board: Cell[][], turn: Cell): boolean => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === "empty" && checkFlip(board, i, j, turn).length > 0) {
          return true;
        }
      }
    }
    return false;
  };
  
  // これ何やっているか確認する
  const checkFlip = (board: Cell[][], row: number, col: number, turn: Cell): number[][] => {
      const directions = [
        [0, 1], [1, 1], [1, 0], [1, -1],
        [0, -1], [-1, -1], [-1, 0], [-1, 1]
      ];
      const opponent = turn === "black" ? "white" : "black";
      let flipped: number[][] = [];
  
      if (board[row][col] !== "empty") {
          return [];
      }
  
      for (const [dx, dy] of directions) {
        let r = row + dx;
        let c = col + dy;
        let currentFlipped: number[][] = [];
  
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
          currentFlipped.push([r, c]);
          r += dx;
          c += dy;
        }
  
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === turn) {
          flipped = flipped.concat(currentFlipped);
        }
      }
      return flipped;
    };

  // ゲーム終了判定
  const isGameOver = (board: Cell[][]): boolean => {
    return !canPlaceStone(board, "black") && !canPlaceStone(board, "white");
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== "empty") {
      return;
    }
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = turn;

    // ひっくり返すロジックを実装
    const directions = [
      [0, 1], [1, 1], [1, 0], [1, -1],
      [0, -1], [-1, -1], [-1, 0], [-1, 1]
    ];

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let flipped = [];

      while (r >= 0 && r < 8 && c >= 0 && c < 8 && newBoard[r][c] !== "empty" && newBoard[r][c] !== turn) {
        flipped.push([r, c]);
        r += dx;
        c += dy;
      }

      if (r >= 0 && r < 8 && c >= 0 && c < 8 && newBoard[r][c] === turn) {
        for (const [fr, fc] of flipped) {
          newBoard[fr][fc] = turn;
        }
      }
    }

    // 石の数を数える
    const countStones = (board: Cell[][]): { black: number; white: number } => {
      let black = 0;
      let white = 0;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (board[i][j] === "black") {
            black++;
          } else if (board[i][j] === "white") {
            white++;
          }
        }
      }
      return { black, white };
    };

    // 勝敗判定
    const determineWinner = (board: Cell[][]): Cell | "draw" => {
      const { black, white } = countStones(board);
      if (black > white) {
        return "black";
      } else if (white > black) {
        return "white";
      } else {
        return "draw";
      }
    };

    setBoard(newBoard);
    // ゲーム終了時アラート
    if (isGameOver(newBoard)) {
      const winner = determineWinner(newBoard);
      if (winner === "draw") {
        alert("引き分け！");
      } else {
        alert(`${winner}の勝ち！`);
      }
      // ゲーム終了時の処理（例：リセットボタンなど）
    } else {
      setTurn(turn === "black" ? "white" : "black");
    }
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

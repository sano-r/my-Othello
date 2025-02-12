import { useState } from "react";

type Cell = "empty" | "black" | "white";

const resetBoard = (): Cell[][] => {
  return [
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "black", "white", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "white", "black", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ];
};

export function Othello() {
  const [board, setBoard] = useState<Cell[][]>(resetBoard);
  const [turn, setTurn] = useState<Cell>("black");

  // 石が置ける場所があるか確認
  const canPlaceStone = (board: Cell[][], turn: Cell): boolean => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          board[i][j] === "empty" &&
          checkFlip(board, i, j, turn).length > 0
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // 挟める石を判定
  const checkFlip = (
    board: Cell[][],
    row: number,
    col: number,
    turn: Cell
  ): number[][] => {
    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];
    const opponent = turn === "black" ? "white" : "black";
    let flipped: number[][] = [];

    if (board[row][col] !== "empty") {
      return [];
    }

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      const currentFlipped: number[][] = [];

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

    const flipped = checkFlip(board, row, col, turn); // 挟める石の数を取得

    if (flipped.length === 0) {
      // 挟める石が無い場合は何もしない
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = turn;

    // ひっくり返すロジックを実装
    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      const flipped = [];

      while (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8 &&
        newBoard[r][c] !== "empty" &&
        newBoard[r][c] !== turn
      ) {
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

  // 初期状態に戻す
  function handleReset(): void {
    setBoard(resetBoard());
    setTurn("black");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">オセロゲーム</h1>
      <div className="flex justify-center items-center">
        <div className="bg-green-700 p-4 max-w-4xl">
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
        <div className="ml-2">
          <div
            className={`p-2 mb-2 rounded-md border border-gray-700 ${
              turn === "black" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            現在のターン
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            リセット
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}

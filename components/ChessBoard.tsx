import React from 'react';

interface ChessBoardProps {
  fen: string;
}

const PIECES: Record<string, string> = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const ChessBoard: React.FC<ChessBoardProps> = ({ fen }) => {
  const boardFen = fen.split(' ')[0];
  const rows = boardFen.split('/');

  const renderSquare = (piece: string | null, rowIdx: number, colIdx: number) => {
    const isDark = (rowIdx + colIdx) % 2 === 1;
    return (
      <div 
        key={`${rowIdx}-${colIdx}`} 
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl select-none ${
          isDark ? 'bg-stellar-dark/50 text-gray-200' : 'bg-gray-200 text-gray-900'
        }`}
      >
        {piece && <span className={piece === piece.toUpperCase() ? 'text-white drop-shadow-md' : 'text-black'}>{PIECES[piece]}</span>}
      </div>
    );
  };

  const board = [];
  for (let r = 0; r < 8; r++) {
    const rowData = rows[r] || "8";
    let col = 0;
    for (let i = 0; i < rowData.length; i++) {
      const char = rowData[i];
      if (!isNaN(parseInt(char))) {
        const emptyCount = parseInt(char);
        for (let k = 0; k < emptyCount; k++) {
          board.push(renderSquare(null, r, col));
          col++;
        }
      } else {
        board.push(renderSquare(char, r, col));
        col++;
      }
    }
  }

  return (
    <div className="inline-block border-4 border-gray-700 rounded shadow-xl bg-gray-800 my-4">
      <div className="grid grid-cols-8 gap-0 bg-gray-900">
        {board}
      </div>
      <div className="text-center py-1 text-xs text-gray-400 bg-gray-900 font-mono">
        {fen.split(' ')[1] === 'w' ? "White to move" : "Black to move"}
      </div>
    </div>
  );
};

export default ChessBoard;
"use client"

import ChessBoard from '@/components/Chessboard'
import EvalBar from '@/components/Evalbar'
import React from 'react'

const Board = () => {
  return (
    <div className="flex gap-1 md:container mx-auto justify-center portrait:flex-col">
      <ChessBoard position={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"} />
      <EvalBar />
    </div>
  )
}

export default Board

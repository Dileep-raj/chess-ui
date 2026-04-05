"use client"

import ChessBoard from '@/components/Chessboard'
import EvalBar from '@/components/Evalbar'
import { getDefaultPositionBoardData } from '@/functions/game/FEN'
import React from 'react'

const Board = () => {
  return (
    <div className="flex gap-1 md:container mx-auto justify-center portrait:flex-col">
      <ChessBoard position={getDefaultPositionBoardData()} />
      <EvalBar />
    </div>
  )
}

export default Board

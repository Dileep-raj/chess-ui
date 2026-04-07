"use client";

import { BoardData, Piece, PieceColor, PieceRank, PieceType, Square, SquareIndex, getSquareRowCol, pieceAssets } from '@/types';
import React, { useState, useEffect, useRef } from 'react'
import { BoardTheme, BoardThemes } from './data';
import { parsePosition, getArrowPath } from '@/functions/board/boardUtils';
import { getDefaultPositionBoardData } from '@/functions/game/FEN';

interface ChessBoardProps {
  position?: string | BoardData;
  flipBoard?: boolean;
  evalBar?: boolean;
  boardTheme?: BoardTheme;
  roundedCorner?: boolean;
  boardSize?: number;
  makeMove?: (from: Square, to: Square, promotionRank?: PieceRank.Queen | PieceRank.Rook | PieceRank.Knight | PieceRank.Bishop) => BoardData
}

const getClickSquare: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => Square = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  const boundingBox = e.currentTarget?.getBoundingClientRect()
  const squareLength = boundingBox.width / 8
  const row = Math.trunc((e.nativeEvent.offsetX) / squareLength)
  const col = Math.trunc((e.nativeEvent.offsetY) / squareLength)
  return SquareIndex[col * 8 + row] as Square
}

const ChessBoard = ({
  position = getDefaultPositionBoardData(),
  flipBoard = false,
  boardTheme = BoardTheme.default,
  roundedCorner = true,
  boardSize = 800,
  makeMove,
}: ChessBoardProps) => {

  const squareSize = boardSize / 8

  const [pieceImages] = useState<{ [key in PieceType]: HTMLImageElement | null }>({ wK: null, wQ: null, wR: null, wB: null, wN: null, wP: null, bK: null, bQ: null, bR: null, bB: null, bN: null, bP: null })
  const [board, setBoard] = useState<BoardData>(parsePosition(position))
  const [arrows, setArrows] = useState<{ [key in Square]?: Array<Square> } | null | undefined>()
  const [selectedSquare, setSelectedSquare] = useState<Square | null | undefined>()
  const [highlightedSquares, setHighlightedSquares] = useState<Set<Square> | null | undefined>();
  const [dragData, setDragData] = useState<{ dragSquare: Square, coordinates: { x: number, y: number } } | null | undefined>()

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);

  const lightColor = BoardThemes[boardTheme].light, darkColor = BoardThemes[boardTheme].dark
  const arrowColor = "#205042bf", previousMoveColor = "#0f235787", selectedSquareColor = "#0007", legalMoveColor = "#3fbacfaa", highlightedSquareColor = "#102e25aa"

  const movePiece = (from: Square, to: Square) => {
    // TODO: Add promotion logic
    if (makeMove) {
      try { setBoard(makeMove(from, to)) }
      catch (error) { console.error(error) }
      return
    }
    if (from == to) return
    if (board.pieces[from]) {
      if (board.pieces[from]?.color == board.pieces[to]?.color) return // If capturing piece of same color
      if (!board.legalMoves[from]?.has(to)) return // If move is not legal
      board.pieces[to] = board.pieces[from] // Move the piece to the new location
      board.pieces[from] = undefined // Remove piece from previous location
      board.previousMove = { from: from, to: to }
      board.turn = board.turn == PieceColor.White ? PieceColor.Black : PieceColor.White
      setBoard(board)
      clearSelection()
      setHighlightedSquares(null)
    }
  }

  const redraw = () => {
    if (contextRef.current) draw(contextRef.current)
    else console.error("Context not found!");
  }

  /**
   * Clear selected square and drag data and redraw board
   */
  const clearSelection = () => {
    setSelectedSquare(null)
    // setHighlightedSquares(null)
    setDragData(null)
    redraw()
  }

  const draw = (c: CanvasRenderingContext2D) => {
    c.clearRect(0, 0, c.canvas.width, c.canvas.height)
    drawBoard(c)
    drawHighlightedSquares(c)
    drawPieces(c)
    drawArrows(c)
  }

  const drawBoard = (c: CanvasRenderingContext2D) => {
    c.fillStyle = darkColor
    c.fillRect(0, 0, boardSize, boardSize)
    c.fillStyle = lightColor
    const path = new Path2D()
    for (let y = 0; y < 8; y++) for (let x = y & 1; x < 8; x += 2) path.rect(x * squareSize, y * squareSize, squareSize, squareSize)
    c.fill(path)
  }

  const drawPieces = (c: CanvasRenderingContext2D) => {
    if (flipBoard) return
    for (const square in board.pieces) {
      if (!Object.hasOwn(board.pieces, square)) continue;
      const piece = board.pieces[square as Square];
      if (piece) {
        const image = pieceImages[`${piece?.color}${piece?.rank}`]
        if (!image) continue
        if (dragData?.dragSquare == square) continue
        const [row, col] = getSquareRowCol(square as Square)
        c.drawImage(image, col * squareSize, row * squareSize, squareSize, squareSize)
      }
    }
    if (dragData?.dragSquare) {
      const piece = board.pieces[dragData.dragSquare as Square];
      if (!piece) return
      const image = pieceImages[`${piece?.color}${piece?.rank}`]
      if (!image) return
      c.drawImage(image, dragData.coordinates.x - squareSize / 2, dragData.coordinates.y - squareSize / 2, squareSize, squareSize)
    }
  }

  const drawArrows = (c: CanvasRenderingContext2D) => {
    for (const from in arrows) {
      if (!Object.hasOwn(arrows, from)) continue;
      const tos = arrows[from as Square];
      tos?.forEach(to => {
        drawArrow(c, from as Square, to)
      });
    }
  }

  const drawArrow = (c: CanvasRenderingContext2D, from: Square, to: Square) => {
    const arrowPath = getArrowPath(from, to, squareSize)
    const arrow = new Path2D(arrowPath)
    c.fillStyle = arrowColor
    c.fill(arrow)
    return arrowPath;
  }

  const drawHighlightedSquares = (c: CanvasRenderingContext2D) => {
    if (dragData?.dragSquare) {
      fillSquare(c, dragData.dragSquare, selectedSquareColor)
      highlightLegalMoves(c, dragData.dragSquare)
    }
    else if (selectedSquare) {
      fillSquare(c, selectedSquare, selectedSquareColor)
      highlightLegalMoves(c, selectedSquare)
    }
    if (board.previousMove) {
      fillSquare(c, board.previousMove.from, previousMoveColor)
      fillSquare(c, board.previousMove.to, previousMoveColor)
    }
    highlightedSquares?.forEach(square => fillSquare(c, square, highlightedSquareColor));
  }

  const fillSquare = (c: CanvasRenderingContext2D, square: Square, color: string, shape: "square" | "circle" = "square") => {
    const [row, col] = getSquareRowCol(square)
    c.fillStyle = color

    if (shape == "square")
      c.fillRect(col * squareSize, row * squareSize, squareSize, squareSize)
    else {
      c.beginPath()
      c.arc((col + 0.5) * squareSize, (row + 0.5) * squareSize, squareSize / 5, 0, 2 * Math.PI)
      c.closePath()
      c.fill()
    }
  }

  const highlightLegalMoves = (c: CanvasRenderingContext2D, square: Square) => {
    board.legalMoves[square]?.forEach(legalMoveSquare => fillSquare(c, legalMoveSquare, legalMoveColor, "circle"));
  }

  const startPieceDrag = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault()
    const square = getClickSquare(e)
    const piece = board.pieces[square]
    if (!piece || piece.color != board.turn) return
    setDragData({
      dragSquare: square,
      coordinates: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    })
    redraw()
  }

  const handleMouseOver = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // TODO: Compare and replace with animation requestAnimationFrame()
    if (dragData) {
      setDragData({
        dragSquare: dragData.dragSquare,
        coordinates: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
      })
      // const square = getClickSquare(e)
      // if (board.legalMoves[dragData.dragSquare]?.has(square)) {
      // setHighlightedSquares(new Set([square]))
      //     redraw()
      // }
    }
  }

  const handlePieceDrop = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const square = getClickSquare(e)
    const toPiece: Piece | null | undefined = board.pieces[square]

    if (dragData) {
      // If clicking on a square
      if (dragData.dragSquare == square) {

        // If a piece is already selected
        if (selectedSquare) {
          const fromPiece: Piece = board.pieces[selectedSquare] as Piece
          if (selectedSquare == square) clearSelection() // If same square selected again remove selection
          else if (fromPiece.color == toPiece?.color) setSelectedSquare(square) // Change selection if same color
          else if (board.legalMoves[selectedSquare]?.has(square)) movePiece(selectedSquare, square) // Move piece if opposite color & legal move
          else clearSelection() // Clear selection if not a legal move
        }
        else if (board.pieces[square]?.color == board.turn) setSelectedSquare(square) // Select the square if there is no previous selection
      }
      else if (board.legalMoves[dragData.dragSquare]?.has(square)) movePiece(dragData.dragSquare, square) // Drag and drop piece if its a legal move
      else clearSelection() // Clear selection if not a legal move

      stopPieceDrag()
    }
    else if (selectedSquare) { // When clicking on an empty square as drag data will be null
      if (board.legalMoves[selectedSquare]?.has(square)) movePiece(selectedSquare, square) // Move piece if its a legal move
      else clearSelection()
    }
  }

  const stopPieceDrag = (e?: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e?.preventDefault()
    setDragData(null)
    redraw()
  }

  const handleRightClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
  }

  useEffect(() => {
    const loadImage = (src: string) => {
      const image = new Image()
      image.src = src
      image.onload = () => redraw()
      return image
    }

    pieceImages.wK = loadImage(pieceAssets.wK.src)
    pieceImages.wQ = loadImage(pieceAssets.wQ.src)
    pieceImages.wR = loadImage(pieceAssets.wR.src)
    pieceImages.wB = loadImage(pieceAssets.wB.src)
    pieceImages.wN = loadImage(pieceAssets.wN.src)
    pieceImages.wP = loadImage(pieceAssets.wP.src)
    pieceImages.bK = loadImage(pieceAssets.bK.src)
    pieceImages.bQ = loadImage(pieceAssets.bQ.src)
    pieceImages.bR = loadImage(pieceAssets.bR.src)
    pieceImages.bB = loadImage(pieceAssets.bB.src)
    pieceImages.bN = loadImage(pieceAssets.bN.src)
    pieceImages.bP = loadImage(pieceAssets.bP.src)
  }, [])

  useEffect(() => {
    const c = canvasRef.current?.getContext('2d')
    if (c) draw(c)
    contextRef.current = c
  })

  const className = `${roundedCorner ? "rounded-md" : ""}`
  return <canvas
    className={className}
    ref={canvasRef}
    width={boardSize}
    height={boardSize}
    style={{ width: boardSize, cursor: dragData ? "grabbing" : "pointer" }}
    draggable={false}
    onMouseMove={handleMouseOver}
    onMouseDown={startPieceDrag}
    onMouseUp={handlePieceDrop}
    onContextMenu={handleRightClick}
    onMouseLeave={() => setDragData(null)}
    onScroll={e => e.preventDefault()}
  />
}

export default ChessBoard;

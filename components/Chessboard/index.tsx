"use client";

import React, { ReactNode, DragEvent, useRef, useState } from "react"
import Image from "next/image"
import { BoardTheme } from "./data"
import { BoardData, Piece, PieceColor, PieceRank, Square, Squares } from "@/types"
import { parseFEN } from "@/functions/game/FEN"
import styles from "./ChessBoard.module.css"
import circle from "@/assets/svg/circle.svg"
import selected from "@/assets/svg/selected_square.svg"
import previousSquare from "@/assets/svg/previous_square.svg"


interface ChessBoardProps {
  position?: string | BoardData;
  flipBoard?: boolean;
  evalBar?: boolean;
  boardTheme?: BoardTheme;
  roundedCorner?: boolean;
  makeMove?: (from: Square, to: Square, promotionRank?: PieceRank.Queen | PieceRank.Rook | PieceRank.Knight | PieceRank.Bishop) => BoardData
}

const themes: { [key in BoardTheme]: { [key in "light" | "dark"]: string } } = {
  default: { light: "#dcc4aa", dark: "#A07655" },
  grey: { light: "#e9e9e9", dark: "#666666" },
  green: { light: "#eeeed2", dark: "#769656" },
  brown: { light: "#f1cca2", dark: "#aa6b40" },
  lichess: { light: "#F0D9B5", dark: "#B58863" },
  blue: { light: "#CEE3F5", dark: "#3F698F" },
};

let dragSquare: Square | null | undefined = undefined
const ChessBoard = ({
  makeMove,
  position = "8/8/8/8/8/8/8/8 w - - 0 1",
  flipBoard = false,
  boardTheme = BoardTheme.default,
  roundedCorner = true,
}: ChessBoardProps) => {
  let boardData: BoardData = {
    fen: "",
    enPassant: null,
    halfMove: 0,
    fullMove: 0,
    turn: PieceColor.White,
    whiteShortCastle: false,
    whiteLongCastle: false,
    blackShortCastle: false,
    blackLongCastle: false,
    pieces: {},
    legalMoves: {}
  };

  try {
    if (typeof position == "string") boardData = parseFEN(position!)
  } catch (error) {
    console.log(error)
  }
  // console.log("Rendered component", Date.now());

  const [highlightedSquares, setHighlightedSquares] = useState<Set<Square> | null | undefined>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null | undefined>(null);
  const [board, setBoard] = useState<BoardData>(typeof position == "string" ? boardData : position!)

  const squareRefs = useRef<HTMLDivElement[]>([]);
  const light = encodeURIComponent(themes[boardTheme].light), dark = encodeURIComponent(themes[boardTheme].dark);
  const board_svg_default = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 80 80'%3E%3Cdefs%3E%3Cstyle%3E:root%7B--light-color:${light};--dark-color:${dark}%7D.light%7Bfill:var(--light-color, %23f1cca2)%7D.dark%7Bfill:var(--dark-color, %23aa6b40)%7D%3C/style%3E%3C/defs%3E%3Cpath fill='%23f1cca2' d='M0 0h80v80H0z' class='light'/%3E%3Cpath fill='%23aa6b40' d='M0 10h10v10H0zm0 20h10v10H0zm0 20h10v10H0zm0 20h10v10H0zM10 0h10v10H10zm0 20h10v10H10zm0 20h10v10H10zm0 20h10v10H10zm10-50h10v10H20zm0 20h10v10H20zm0 20h10v10H20zm0 20h10v10H20zM30 0h10v10H30zm0 20h10v10H30zm0 20h10v10H30zm0 20h10v10H30zm10-50h10v10H40zm0 20h10v10H40zm0 20h10v10H40zm0 20h10v10H40zM50 0h10v10H50zm0 20h10v10H50zm0 20h10v10H50zm0 20h10v10H50zm10-50h10v10H60zm0 20h10v10H60zm0 20h10v10H60zm0 20h10v10H60zM70 0h10v10H70zm0 20h10v10H70zm0 20h10v10H70zm0 20h10v10H70z' class='dark'/%3E%3Cpath stroke-width='.028' d='M.91 71.5H.744v-.8l-.244.083v-.14l.389-.143h.02z' class='light'/%3E%3Cpath stroke-width='.028' d='M1.182 61.5H.519v-.113l.328-.359q.072-.079.102-.132.03-.053.03-.107 0-.07-.04-.114-.04-.043-.106-.043-.08 0-.124.049t-.044.133H.5q0-.09.041-.162.04-.072.117-.112.076-.04.176-.04.144 0 .226.072.083.072.083.2 0 .073-.041.154-.042.081-.137.184l-.24.258h.457z' class='dark'/%3E%3Cpath stroke-width='.027' d='M.708 50.926h.099q.075 0 .118-.039.044-.038.044-.11 0-.07-.036-.108-.037-.039-.112-.039-.065 0-.107.038-.042.038-.042.099H.509q0-.075.04-.137.04-.061.111-.096.071-.034.16-.034.145 0 .228.073.084.073.084.204 0 .065-.042.123-.042.058-.108.087.08.028.122.087.041.058.041.14 0 .13-.09.208-.09.078-.236.078-.14 0-.23-.075Q.5 51.35.5 51.226h.162q0 .064.044.104.043.04.115.04.076 0 .12-.04.043-.04.043-.116 0-.077-.045-.119-.046-.04-.136-.04H.708z' class='light'/%3E%3Cpath stroke-width='.028' d='M1.104 41.144h.124v.133h-.124v.223H.937v-.223H.505L.5 41.176l.431-.676h.173v.644m-.429 0h.262v-.418l-.013.022z' class='dark'/%3E%3Cpath stroke-width='.028' d='m.53 30.997.054-.497h.53v.142H.72l-.027.236q.068-.04.154-.04.141 0 .22.09.078.09.078.243 0 .15-.087.24-.087.089-.238.089-.135 0-.224-.077-.09-.077-.097-.203h.16q.009.072.05.11.043.038.11.038.076 0 .119-.054.042-.054.042-.148 0-.09-.047-.142-.047-.053-.129-.053-.044 0-.075.012-.032.012-.068.047z' class='light'/%3E%3Cpath stroke-width='.028' d='M1.004 20.5v.136h-.02q-.137.001-.22.075-.082.073-.097.208.079-.083.201-.083.13 0 .205.092.076.092.076.237 0 .15-.088.242-.088.093-.231.093-.147 0-.239-.109Q.5 21.283.5 21.107v-.056q0-.259.126-.405.126-.146.361-.146h.017m-.176.469q-.053 0-.099.03-.044.03-.065.081v.05q0 .109.046.173.045.065.118.065t.116-.055q.042-.055.042-.144 0-.088-.043-.145Q.9 20.97.828 20.97z' class='dark'/%3E%3Cpath stroke-width='.028' d='m1.193 10.593-.4.907H.618l.399-.866H.5V10.5h.693z' class='light'/%3E%3Cpath stroke-width='.027' d='M1.116.77q0 .072-.036.127-.037.056-.1.088.075.036.116.097.042.062.042.14 0 .127-.087.203Q.964 1.5.819 1.5q-.145 0-.232-.076Q.5 1.35.5 1.221q0-.078.041-.14.042-.062.117-.096Q.595.953.558.897.523.842.523.77q0-.124.08-.197Q.682.5.82.5t.217.073q.08.073.08.197m-.14.443q0-.072-.044-.117-.043-.044-.114-.044-.07 0-.113.044t-.043.117q0 .072.042.115.042.042.115.042.074 0 .115-.041.041-.042.041-.116M.955.776Q.954.713.917.67.88.631.818.631.758.63.722.668.685.71.685.776T.72.882q.036.04.098.04.063 0 .099-.04Q.954.843.954.776z' class='dark'/%3E%3Cpath stroke-width='.029' d='M9.286 79.486q-.012-.023-.02-.072-.083.086-.203.086-.116 0-.19-.067-.073-.066-.073-.163 0-.124.092-.19.091-.066.262-.066h.106v-.05q0-.06-.034-.096-.033-.036-.102-.036-.059 0-.097.03-.038.03-.038.075h-.173q0-.064.042-.12.042-.054.115-.085.072-.032.161-.032.136 0 .216.068.08.068.083.192v.347q0 .105.03.166v.013h-.177m-.19-.125q.05 0 .096-.025.045-.025.068-.067v-.146h-.094q-.096 0-.144.034-.049.034-.049.095 0 .05.033.08.033.029.09.029z' class='light'/%3E%3Cpath stroke-width='.029' d='M19.471 79.161q0 .178-.079.284-.08.105-.219.105-.134 0-.21-.097l-.007.083H18.8V78.45h.172v.394q.074-.087.2-.087.14 0 .22.104.08.104.08.29v.01m-.172-.015q0-.124-.044-.186-.044-.063-.127-.063-.112 0-.157.098v.315q.046.1.158.1.08 0 .125-.06.043-.06.045-.182z' class='dark'/%3E%3Cpath stroke-width='.029' d='M29.15 79.362q.064 0 .107-.038t.045-.093h.164q-.003.071-.045.134-.042.062-.114.099-.072.036-.155.036-.163 0-.257-.105-.095-.105-.095-.29v-.017q0-.176.094-.282.094-.106.257-.106.137 0 .224.08t.09.21h-.163q-.002-.065-.045-.108-.042-.043-.108-.043-.084 0-.13.061-.045.061-.046.185v.028q0 .125.045.187.046.062.131.062z' class='light'/%3E%3Cpath stroke-width='.029' d='M38.8 79.148q0-.177.082-.284.082-.107.22-.107.121 0 .196.084v-.391h.172v1.086h-.155l-.009-.08q-.077.094-.205.094-.135 0-.218-.108-.083-.109-.083-.294m.172.015q0 .116.045.181.044.066.127.066.106 0 .154-.094v-.327q-.047-.092-.152-.092-.084 0-.129.066-.045.067-.045.2z' class='dark'/%3E%3Cpath stroke-width='.029' d='M49.17 79.5q-.165 0-.268-.104-.102-.104-.102-.276v-.021q0-.116.045-.207.044-.09.125-.141.08-.051.18-.051.157 0 .243.1.086.101.086.285v.07h-.504q.007.095.064.15.055.057.14.057.12 0 .194-.097l.094.09q-.047.069-.124.107-.078.038-.174.038m-.02-.661q-.072 0-.115.05-.045.05-.056.139h.33v-.013q-.006-.087-.047-.131-.04-.045-.112-.045z' class='light'/%3E%3Cpath stroke-width='.029' d='M59.067 79.55v-.637h-.117v-.127h.117v-.07q0-.127.07-.197.07-.069.198-.069.045 0 .096.013l-.004.134q-.029-.006-.066-.006-.123 0-.123.127v.068h.156v.127h-.156v.637z' class='dark'/%3E%3Cpath stroke-width='.028' d='M68.8 79.08q0-.173.081-.276.082-.104.216-.104.128 0 .2.089l.008-.075h.15v.72q0 .147-.09.231-.092.085-.246.085-.082 0-.16-.034t-.119-.089l.08-.1q.076.091.19.091.082 0 .13-.045t.048-.132v-.05q-.072.08-.192.08-.13 0-.213-.104-.083-.104-.083-.287m.166.015q0 .112.046.176.046.064.127.064.1 0 .15-.087v-.327q-.048-.084-.149-.084-.082 0-.128.065t-.046.193z' class='light'/%3E%3Cpath stroke-width='.029' d='M78.974 78.86q.085-.1.216-.1.247 0 .25.284v.506h-.173v-.5q0-.08-.035-.113-.035-.034-.102-.034-.104 0-.156.093v.554H78.8v-1.1h.174z' class='dark'/%3E%3C/svg%3E")`;
  const board_svg_reverse = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 80 80'%3E%3Cdefs%3E%3Cstyle%3E:root%7B--light-color:${light};--dark-color:${dark}%7D.light%7Bfill:var(--light-color, %23f1cca2)%7D.dark%7Bfill:var(--dark-color, %23aa6b40)%7D%3C/style%3E%3C/defs%3E%3Cpath fill='%23f1cca2' d='M0 0h80v80H0z' class='light'/%3E%3Cpath fill='%23aa6b40' d='M0 10h10v10H0zm0 20h10v10H0zm0 20h10v10H0zm0 20h10v10H0zM10 0h10v10H10zm0 20h10v10H10zm0 20h10v10H10zm0 20h10v10H10zm10-50h10v10H20zm0 20h10v10H20zm0 20h10v10H20zm0 20h10v10H20zM30 0h10v10H30zm0 20h10v10H30zm0 20h10v10H30zm0 20h10v10H30zm10-50h10v10H40zm0 20h10v10H40zm0 20h10v10H40zm0 20h10v10H40zM50 0h10v10H50zm0 20h10v10H50zm0 20h10v10H50zm0 20h10v10H50zm10-50h10v10H60zm0 20h10v10H60zm0 20h10v10H60zm0 20h10v10H60zM70 0h10v10H70zm0 20h10v10H70zm0 20h10v10H70zm0 20h10v10H70z' class='dark'/%3E%3Cpath stroke-width='.028' d='M.91 1.5H.744V.7L.5.783v-.14L.889.5h.02z' class='dark'/%3E%3Cpath stroke-width='.028' d='M1.182 11.5H.519v-.113l.328-.359q.072-.079.102-.132.03-.053.03-.107 0-.07-.04-.114-.04-.043-.106-.043-.08 0-.124.049t-.044.133H.5q0-.09.041-.162.04-.072.117-.112.076-.04.176-.04.144 0 .226.072.083.072.083.2 0 .073-.041.154-.042.081-.137.184l-.24.258h.457z' class='light'/%3E%3Cpath stroke-width='.027' d='M.708 20.926h.099q.075 0 .118-.039.044-.038.044-.11 0-.07-.036-.108-.037-.039-.112-.039-.065 0-.107.038-.042.038-.042.099H.509q0-.075.04-.137.04-.061.111-.096.071-.034.16-.034.145 0 .228.073.084.073.084.204 0 .065-.042.123-.042.058-.108.087.08.028.122.087.041.058.041.14 0 .13-.09.208-.09.078-.236.078-.14 0-.23-.075Q.5 21.35.5 21.226h.162q0 .064.044.104.043.04.115.04.076 0 .12-.04.043-.04.043-.116 0-.077-.045-.119-.046-.04-.136-.04H.708Z' class='dark'/%3E%3Cpath stroke-width='.028' d='M1.104 31.144h.124v.133h-.124v.223H.937v-.223H.505L.5 31.176l.431-.676h.173v.644m-.429 0h.262v-.418l-.013.022z' class='light'/%3E%3Cpath stroke-width='.028' d='m.53 40.997.054-.497h.53v.142H.72l-.027.236q.068-.04.154-.04.141 0 .22.09.078.09.078.243 0 .15-.087.24-.087.089-.238.089-.135 0-.224-.077-.09-.077-.097-.203h.16q.009.072.05.11.043.038.11.038.076 0 .119-.054.042-.054.042-.148 0-.09-.047-.142-.047-.053-.129-.053-.044 0-.075.012-.032.012-.068.047z' class='dark'/%3E%3Cpath stroke-width='.028' d='M1.004 50.5v.136h-.02q-.137.001-.22.075-.082.073-.097.208.079-.083.201-.083.13 0 .205.092.076.092.076.237 0 .15-.088.242-.088.093-.231.093-.147 0-.239-.109Q.5 51.283.5 51.107v-.056q0-.259.126-.405.126-.146.361-.146h.017m-.176.469q-.053 0-.099.03-.044.03-.065.081v.05q0 .109.046.173.045.065.118.065t.116-.055q.042-.055.042-.144 0-.088-.043-.145Q.9 50.97.828 50.97Z' class='light'/%3E%3Cpath stroke-width='.028' d='m1.193 60.593-.4.907H.618l.399-.866H.5V60.5h.693z' class='dark'/%3E%3Cpath stroke-width='.027' d='M1.116 70.77q0 .072-.036.127-.037.056-.1.088.075.036.116.097.042.062.042.14 0 .127-.087.203-.087.075-.232.075-.145 0-.232-.076Q.5 71.35.5 71.221q0-.078.041-.14.042-.062.117-.096-.063-.032-.1-.088-.035-.055-.035-.127 0-.124.08-.197.079-.073.217-.073t.217.073q.08.073.08.197m-.14.443q0-.072-.044-.117-.043-.044-.114-.044-.07 0-.113.044t-.043.117q0 .072.042.115.042.042.115.042.074 0 .115-.041.041-.042.041-.116m-.021-.437q-.001-.063-.038-.106-.037-.039-.099-.039-.06-.001-.096.037-.037.042-.037.108t.035.106q.036.04.098.04.063 0 .099-.04.037-.039.037-.106z' class='light'/%3E%3Cpath stroke-width='.029' d='M79.286 79.486q-.012-.023-.02-.072-.083.086-.203.086-.116 0-.19-.067-.073-.066-.073-.163 0-.124.092-.19.091-.066.262-.066h.106v-.05q0-.06-.034-.096-.033-.036-.102-.036-.059 0-.097.03-.038.03-.038.075h-.173q0-.064.042-.12.042-.054.115-.085.072-.032.161-.032.136 0 .216.068.08.068.083.192v.347q0 .105.03.166v.013h-.177m-.19-.125q.05 0 .096-.025.045-.025.068-.067v-.146h-.094q-.096 0-.144.034-.049.034-.049.095 0 .05.033.08.033.029.09.029z' class='dark'/%3E%3Cpath stroke-width='.029' d='M69.471 79.161q0 .178-.079.284-.08.105-.219.105-.134 0-.21-.097l-.007.083H68.8V78.45h.172v.394q.074-.087.2-.087.14 0 .22.104.08.104.08.29v.01m-.172-.015q0-.124-.044-.186-.044-.063-.127-.063-.112 0-.157.098v.315q.046.1.158.1.08 0 .125-.06.043-.06.045-.182z' class='light'/%3E%3Cpath stroke-width='.029' d='M59.15 79.362q.064 0 .107-.038t.045-.093h.164q-.003.071-.045.134-.042.062-.114.099-.072.036-.155.036-.163 0-.257-.105-.095-.105-.095-.29v-.017q0-.176.094-.282.094-.106.257-.106.137 0 .224.08t.09.21h-.163q-.002-.065-.045-.108-.042-.043-.108-.043-.084 0-.13.061-.045.061-.046.185v.028q0 .125.045.187.046.062.131.062z' class='dark'/%3E%3Cpath stroke-width='.029' d='M48.8 79.148q0-.177.082-.284.082-.107.22-.107.121 0 .196.084v-.391h.172v1.086h-.155l-.009-.08q-.077.094-.205.094-.135 0-.218-.108-.083-.109-.083-.294m.172.015q0 .116.045.181.044.066.127.066.106 0 .154-.094v-.327q-.047-.092-.152-.092-.084 0-.129.066-.045.067-.045.2z' class='light'/%3E%3Cpath stroke-width='.029' d='M39.17 79.5q-.165 0-.268-.104-.102-.104-.102-.276v-.021q0-.116.045-.207.044-.09.125-.141.08-.051.18-.051.157 0 .243.1.086.101.086.285v.07h-.504q.007.095.064.15.055.057.14.057.12 0 .194-.097l.094.09q-.047.069-.124.107-.078.038-.174.038m-.02-.661q-.072 0-.115.05-.045.05-.056.139h.33v-.013q-.006-.087-.047-.131-.04-.045-.112-.045z' class='dark'/%3E%3Cpath stroke-width='.029' d='M29.067 79.55v-.637h-.117v-.127h.117v-.07q0-.127.07-.197.07-.069.198-.069.045 0 .096.013l-.004.134q-.029-.006-.066-.006-.123 0-.123.127v.068h.156v.127h-.156v.637z' class='light'/%3E%3Cpath stroke-width='.028' d='M18.8 79.08q0-.173.081-.276.082-.104.216-.104.128 0 .2.089l.008-.075h.15v.72q0 .147-.09.231-.092.085-.246.085-.082 0-.16-.034t-.119-.089l.08-.1q.076.091.19.091.082 0 .13-.045t.048-.132v-.05q-.072.08-.192.08-.13 0-.213-.104-.083-.104-.083-.287m.166.015q0 .112.046.176.046.064.127.064.1 0 .15-.087v-.327q-.048-.084-.149-.084-.082 0-.128.065t-.046.193z' class='dark'/%3E%3Cpath stroke-width='.029' d='M8.974 78.86q.085-.1.216-.1.247 0 .25.284v.506h-.173v-.5q0-.08-.035-.113-.035-.034-.102-.034-.104 0-.156.093v.554H8.8v-1.1h.174z' class='light'/%3E%3C/svg%3E")`

  const clearSelection = () => setSelectedSquare(null)
  const highlightLegalMoves = (square: Square) => setHighlightedSquares(board.legalMoves[square] ?? new Set<Square>())

  const handlePieceDragStart = (e: DragEvent<HTMLDivElement>) => {
    dragSquare = Squares[squareRefs.current.indexOf(e.currentTarget)]
    setSelectedSquare(dragSquare)
    highlightLegalMoves(dragSquare)
  };

  const handleDragEnterSquare = (e: DragEvent<HTMLDivElement>) => {
    if (!dragSquare) return;
    const square: Square = Squares[squareRefs.current.indexOf(e.currentTarget)]
    const piece: Piece | null | undefined = board.pieces[square]
    if (piece?.color != board.turn) {
      if (board.legalMoves[dragSquare]?.has(square)) setHighlightedSquares(new Set<Square>([square]))
    }
  }

  const handleDropOnSquare = (e: DragEvent<HTMLDivElement>) => {
    if (!dragSquare) return;
    e.stopPropagation();
    if (dragSquare) {
      const square: Square = Squares[squareRefs.current.indexOf(e.currentTarget)]
      if (dragSquare == square) setSelectedSquare(square)
      else movePiece(dragSquare, square)
    }
    dragSquare = null
  };

  const handleDragLeaveSquare = () => {
    if (!dragSquare) return;
  }

  const handlePieceDragEnd = () => {
    dragSquare = null
    clearSelection()
    setBoard(board)
  }

  const movePiece = (from: Square, to: Square) => {
    if (makeMove) {
      try { setBoard(makeMove(from, to)) }
      catch (error) { console.error(error) }
      return
    }
    if (from == to) return
    if (board.pieces[from]) {
      if (board.pieces[from]?.color == board.pieces[to]?.color) return // If capturing piece of same color
      if (!board.legalMoves[from]?.has(Square[to])) return // If move not in legal moves
      board.pieces[to] = board.pieces[from] // Move the piece to the new location
      board.pieces[from] = undefined // Remove piece from previous location
      setBoard(board)
      clearSelection()
      setHighlightedSquares(null)
    }
  }

  const handleSquareClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const currentSquare: Square = Squares[squareRefs.current.indexOf(e.currentTarget)]
    const toPiece: Piece | null | undefined = board.pieces[currentSquare]

    if (selectedSquare) { // If piece already selected
      if (selectedSquare == currentSquare) clearSelection() // If same square selected again remove selection
      else {
        const fromPiece: Piece = board.pieces[selectedSquare] as Piece
        if (fromPiece.color == toPiece?.color) setSelectedSquare(currentSquare) // Change selection if same color
        else movePiece(selectedSquare, currentSquare) // Move piece if opposite color
      }
    }
    else if (board.pieces[currentSquare]?.color == board.turn) setSelectedSquare(currentSquare) // Select the square if there is no previous selection
  }

  const handleRightClickSquare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
  }

  const handleMouseOver = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (dragSquare || selectedSquare) return;
    const square: Square = Squares[squareRefs.current.indexOf(e.currentTarget)]
    if (board.pieces[square] && board.legalMoves[square]) highlightLegalMoves(square)
  }

  const handleMouseLeave = () => {
    if (dragSquare || selectedSquare) return;
    if (highlightedSquares) setHighlightedSquares(null)
  }

  const addToRef = (el: HTMLDivElement | null) => { if (el && !squareRefs.current.includes(el)) squareRefs.current.push(el); }

  const getBoard = () => {
    const squares: ReactNode[] = [];
    for (let index = 0; index < 64; index++) {
      const square = Squares[flipBoard ? 64 - index : index]
      const piece = board.pieces[square]
      squares.push(
        <div
          key={square}
          data-square={square}
          onContextMenu={handleRightClickSquare}
          onClick={handleSquareClick}
          onDragStart={handlePieceDragStart}
          onDragOver={e => e.preventDefault()}
          onDragEnter={handleDragEnterSquare}
          onDragLeave={handleDragLeaveSquare}
          onDragEnd={handlePieceDragEnd}
          onDrop={handleDropOnSquare}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          className={styles.chessSquare}
          style={{ backgroundImage: selectedSquare == square ? `url(${selected.src})` : highlightedSquares?.has(Square[square]) ? `url(${circle.src})` : "none" }}
          ref={addToRef}
        >
          {piece && <Image draggable={piece.color == board.turn} src={piece.svg} alt={`${piece.color}${piece.rank.toLowerCase()}`} fill={true} />}
        </div>
      )
    }
    return <> {squares} </>;
  };

  return (
    <div className="flex justify-center w-full max-w-3xl aspect-square">
      <div
        // data-board-theme={boardTheme}
        style={{ backgroundImage: flipBoard ? board_svg_reverse : board_svg_default }}
        onScroll={(e) => e.preventDefault()}
        className={`${styles.board} select-none w-full ${roundedCorner ? "rounded-lg" : ""}`}
      >
        {getBoard()}
      </div>
    </div>
  );
};

export default ChessBoard;

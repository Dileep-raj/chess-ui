import { BoardData, PieceColor, Square, getSquareRowCol } from "@/types";
import { parseFEN } from "../game/FEN";


export const parsePosition = (position: string | BoardData) => {
    let boardData: BoardData = {
        fen: "8/8/8/8/8/8/8/8 w - - 0 1",
        enPassant: null,
        halfMove: 0,
        fullMove: 0,
        turn: PieceColor.White,
        whiteShortCastle: false,
        whiteLongCastle: false,
        blackShortCastle: false,
        blackLongCastle: false,
        previousMove: null,
        pieces: {},
        legalMoves: {}
    };

    try {
        if (typeof position == "string") boardData = parseFEN(position!)
    } catch (error) {
        console.error(error)
    }
    return typeof position == "string" ? boardData : position
}

export const getArrowPath = (from: Square, to: Square, squareSize: number) => {
    const [fromRow, fromCol] = getSquareRowCol(from)
    const [toRow, toCol] = getSquareRowCol(to)

    const arrowSideLength = squareSize / 2.5, arrowHeight = arrowSideLength * Math.sin(Math.PI / 3), linewidth = squareSize / 9, gap = squareSize / 10
    const angleOfSlope = Math.atan2((toRow - fromRow), (toCol - fromCol)) + Math.PI / 2, sin = Math.sin(angleOfSlope), cos = Math.cos(angleOfSlope)

    const start_x = (fromCol + 0.5) * squareSize, start_y = (fromRow + 0.5) * squareSize
    const apex_x = (toCol + 0.5) * squareSize, apex_y = (toRow + 0.5) * squareSize

    const arrow_left_x = apex_x - arrowSideLength / 2 * cos - arrowHeight * sin
    const arrow_left_y = apex_y - arrowSideLength / 2 * sin + arrowHeight * cos
    const arrow_right_x = apex_x + arrowSideLength / 2 * cos - arrowHeight * sin
    const arrow_right_y = apex_y + arrowSideLength / 2 * sin + arrowHeight * cos

    const base_x = (arrow_left_x + arrow_right_x) / 2, base_y = (arrow_left_y + arrow_right_y) / 2
    const rbx = base_x + linewidth / 2 * cos, rby = base_y + linewidth / 2 * sin
    const lbx = base_x - linewidth / 2 * cos, lby = base_y - linewidth / 2 * sin
    const lcos = (linewidth + gap) * Math.cos(angleOfSlope + Math.PI / 2), lsin = (linewidth + gap) * Math.sin(angleOfSlope + Math.PI / 2)
    const rsx = (start_x - lcos) + linewidth / 2 * cos, rsy = (start_y - lsin) + linewidth / 2 * sin
    const lsx = (start_x - lcos) - linewidth / 2 * cos, lsy = (start_y - lsin) - linewidth / 2 * sin

    const arrowPath = `
        M${apex_x},${apex_y}
        L${arrow_right_x},${arrow_right_y}
        L${rbx},${rby}
        L${rsx},${rsy}
        A${linewidth / 2},${linewidth / 2},0,0,1${lsx},${lsy}
        L${lbx},${lby}
        L${arrow_left_x},${arrow_left_y}
        Z
    `.replaceAll(/\s+/g, " ").trim();
    return arrowPath;
}

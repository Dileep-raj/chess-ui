import bK from "@/assets/svg/pieces/bK.svg";
import bQ from "@/assets/svg/pieces/bQ.svg";
import bR from "@/assets/svg/pieces/bR.svg";
import bN from "@/assets/svg/pieces/bN.svg";
import bB from "@/assets/svg/pieces/bB.svg";
import bP from "@/assets/svg/pieces/bP.svg";
import wK from "@/assets/svg/pieces/wK.svg";
import wQ from "@/assets/svg/pieces/wQ.svg";
import wR from "@/assets/svg/pieces/wR.svg";
import wN from "@/assets/svg/pieces/wN.svg";
import wB from "@/assets/svg/pieces/wB.svg";
import wP from "@/assets/svg/pieces/wP.svg";
import * as constants from "@/constants";


export const SquareStrings = [
  "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
  "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
  "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
  "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
  "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
  "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
  "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
  "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"
]

export enum SquareIndex {
  a8 = 0, b8 = 1, c8 = 2, d8 = 3, e8 = 4, f8 = 5, g8 = 6, h8 = 7,
  a7 = 8, b7 = 9, c7 = 10, d7 = 11, e7 = 12, f7 = 13, g7 = 14, h7 = 15,
  a6 = 16, b6 = 17, c6 = 18, d6 = 19, e6 = 20, f6 = 21, g6 = 22, h6 = 23,
  a5 = 24, b5 = 25, c5 = 26, d5 = 27, e5 = 28, f5 = 29, g5 = 30, h5 = 31,
  a4 = 32, b4 = 33, c4 = 34, d4 = 35, e4 = 36, f4 = 37, g4 = 38, h4 = 39,
  a3 = 40, b3 = 41, c3 = 42, d3 = 43, e3 = 44, f3 = 45, g3 = 46, h3 = 47,
  a2 = 48, b2 = 49, c2 = 50, d2 = 51, e2 = 52, f2 = 53, g2 = 54, h2 = 55,
  a1 = 56, b1 = 57, c1 = 58, d1 = 59, e1 = 60, f1 = 61, g1 = 62, h1 = 63
}

export type Square = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'}`

/**
 * Converts Square to row and column indices
 * @returns [row: number, col: number]
 */
export const getSquareRowCol = (s: Square) => {
  const num = SquareIndex[s] as number
  return [Math.trunc(num / 8), num % 8] as const
}

export enum PieceRank {
  King = "K",
  Queen = "Q",
  Rook = "R",
  Knight = "N",
  Bishop = "B",
  Pawn = "P",
}

export enum PieceColor {
  White = "w",
  Black = "b",
}

export type PieceType = `${PieceColor}${PieceRank}`

export type BoardData = {
  fen: string;
  enPassant: Square | null;
  whiteKing?: Square;
  blackKing?: Square;
  halfMove: number;
  fullMove: number;
  turn: PieceColor;
  whiteShortCastle: boolean;
  whiteLongCastle: boolean;
  blackShortCastle: boolean;
  blackLongCastle: boolean;
  previousMove?: { from: Square, to: Square } | null;
  pieces: { [key in Square]?: Piece };
  legalMoves: { [key in Square]?: Set<Square> };
};

export const pieceAssets: { [key in PieceType]: { src: string, unicode: string }; } = {
  wK: { src: wK.src, unicode: constants.unicode_wk },
  wQ: { src: wQ.src, unicode: constants.unicode_wq },
  wR: { src: wR.src, unicode: constants.unicode_wr },
  wN: { src: wN.src, unicode: constants.unicode_wn },
  wB: { src: wB.src, unicode: constants.unicode_wb },
  wP: { src: wP.src, unicode: constants.unicode_wp },
  bK: { src: bK.src, unicode: constants.unicode_bk },
  bQ: { src: bQ.src, unicode: constants.unicode_bq },
  bR: { src: bR.src, unicode: constants.unicode_br },
  bN: { src: bN.src, unicode: constants.unicode_bn },
  bB: { src: bB.src, unicode: constants.unicode_bb },
  bP: { src: bP.src, unicode: constants.unicode_bp },
}

export class Piece {
  public color: PieceColor;
  public rank: PieceRank;
  public row: number;
  public col: number;
  public src: string;
  public unicode: string;
  constructor(color: PieceColor, rank: PieceRank, row: number, col: number) {
    this.color = color;
    this.rank = rank;
    this.row = row;
    this.col = col;
    this.src = pieceAssets[`${color}${rank}`].src;
    this.unicode = pieceAssets[`${color}${rank}`].unicode;
  }
}

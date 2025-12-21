import kb_svg from "@/assets/svg/pieces/kb.svg";
import qb_svg from "@/assets/svg/pieces/qb.svg";
import rb_svg from "@/assets/svg/pieces/rb.svg";
import nb_svg from "@/assets/svg/pieces/nb.svg";
import bb_svg from "@/assets/svg/pieces/bb.svg";
import pb_svg from "@/assets/svg/pieces/pb.svg";
import kw_svg from "@/assets/svg/pieces/kw.svg";
import qw_svg from "@/assets/svg/pieces/qw.svg";
import rw_svg from "@/assets/svg/pieces/rw.svg";
import nw_svg from "@/assets/svg/pieces/nw.svg";
import bw_svg from "@/assets/svg/pieces/bw.svg";
import pw_svg from "@/assets/svg/pieces/pw.svg";
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

export enum Square {
  a8, b8, c8, d8, e8, f8, g8, h8,
  a7, b7, c7, d7, e7, f7, g7, h7,
  a6, b6, c6, d6, e6, f6, g6, h6,
  a5, b5, c5, d5, e5, f5, g5, h5,
  a4, b4, c4, d4, e4, f4, g4, h4,
  a3, b3, c3, d3, e3, f3, g3, h3,
  a2, b2, c2, d2, e2, f2, g2, h2,
  a1, b1, c1, d1, e1, f1, g1, h1
}

export const Squares = Object.values(Square).filter(key => isNaN(Number(key))) as Square[]

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
  previousSquare?: Square | null;
  pieces: { [key in Square]?: Piece };
  legalMoves: { [key in Square]?: Set<Square> };
};

const whiteSVGs: { [key in PieceRank]: { [key in "svg" | "unicode"]: string }; } = {
  [PieceRank.King]: { svg: kw_svg, unicode: constants.unicode_wk },
  [PieceRank.Queen]: { svg: qw_svg, unicode: constants.unicode_wq },
  [PieceRank.Rook]: { svg: rw_svg, unicode: constants.unicode_rw },
  [PieceRank.Knight]: { svg: nw_svg, unicode: constants.unicode_wn },
  [PieceRank.Bishop]: { svg: bw_svg, unicode: constants.unicode_wb },
  [PieceRank.Pawn]: { svg: pw_svg, unicode: constants.unicode_wp },
};

const blackSVGs: { [key in PieceRank]: { [key in "svg" | "unicode"]: string }; } = {
  [PieceRank.King]: { svg: kb_svg, unicode: constants.unicode_bk },
  [PieceRank.Queen]: { svg: qb_svg, unicode: constants.unicode_bq },
  [PieceRank.Rook]: { svg: rb_svg, unicode: constants.unicode_br },
  [PieceRank.Knight]: { svg: nb_svg, unicode: constants.unicode_bn },
  [PieceRank.Bishop]: { svg: bb_svg, unicode: constants.unicode_bb },
  [PieceRank.Pawn]: { svg: pb_svg, unicode: constants.unicode_bp },
};

export class Piece {
  public color: PieceColor;
  public rank: PieceRank;
  public row: number;
  public col: number;
  public svg: string;
  public unicode: string;
  constructor(color: PieceColor, rank: PieceRank, row: number, col: number) {
    this.color = color;
    this.rank = rank;
    this.row = row;
    this.col = col;
    if (color == PieceColor.White) {
      this.svg = whiteSVGs[rank].svg;
      this.unicode = whiteSVGs[rank].unicode;
    } else {
      this.svg = blackSVGs[rank].svg;
      this.unicode = blackSVGs[rank].unicode;
    }
  }
}

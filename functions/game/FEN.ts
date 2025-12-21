import { BoardData, Piece, PieceColor, PieceRank, Square, Squares } from "@/types";
import * as misc from "../misc";

const FENRegex = /^([KQRNBPkqbnrp1-8]+\/){7}[KQRNBPkqbnrp1-8]+ [wb] (-|K?Q?k?q?) (-|[a-h][1-8]) \d+ \d+$/;
const defaultFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const validateFEN = (FEN: string) => {
  if (!FENRegex.test(FEN)) return `Invalid FEN!\n${FEN}`;
  const fields = FEN.split(" ");
  if ((fields[0].match(/K/) || []).length != 1) return `Invalid FEN!\n${FEN}`;
  if ((fields[0].match(/k/) || []).length != 1) return `Invalid FEN!\n${FEN}`;
  const ranks = fields[0].split("/")
  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];
    if (rank.length > 8) return `Invalid position at rank ${8 - i}\n${FEN}`;
    let c = 0;
    if ((i == 0 || i == 7) && rank.toLowerCase().includes("p")) return `Invalid position: Pawn at rank ${8 - i}\n${FEN}`;
    for (let j = 0; j < rank.length; j++) {
      const ch = rank[j];
      if (misc.isAlpha(ch)) {
        switch (ch.toLowerCase()) {
          case "k":
          case "q":
          case "r":
          case "n":
          case "b":
          case "p": c++; break;
          default: return `Invalid character '${ch}' at rank ${8 - i}`;
        }
      }
      else if (misc.isDigit(ch)) c += parseInt(ch);
      else return `Invalid character: '${ch}'\n${FEN}`;
    }
    if (c != 8) return `Invalid position at rank ${8 - i}\n${FEN}`;
  }
}

export const parseFEN = (FEN: string) => {
  const validation = validateFEN(FEN)
  if (validation) throw new Error(validation);

  const fields = FEN.split(" ");

  if (fields.length < 4 || fields.length > 6) throw new Error("Invalid FEN!\n" + FEN);

  const board = fields[0];
  const playerToPlay = fields[1];
  const castleAvailability = fields[2];
  const enPassantSquare = fields[3] === "-" ? null : Square[fields[3] as keyof typeof Square];

  let halfMoveClock = 0;
  let fullMoveClock = 1;

  try {
    halfMoveClock = parseInt(fields[4]);
    fullMoveClock = parseInt(fields[5]);
  } catch (error) {
    console.log("Error while parsing halfMove and fullMove clocks!", error);
    throw new Error("Invalid FEN!\n" + FEN);
  }

  const rows = board.split("/");
  if (rows.length != 8) throw new Error("Invalid FEN!\n" + FEN);

  const turn: PieceColor =
    playerToPlay === "w" ? PieceColor.White : PieceColor.Black;

  const pieces: { [key in Square]?: Piece } = {};
  const legalMoves: { [key in Square]?: Set<Square> } = {};

  let whiteKing, blackKing;

  for (let rowNo = 0; rowNo < 8; rowNo++) {
    let col = 0;
    const row = rows[rowNo];
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (misc.isDigit(ch)) {
        col += parseInt(ch);
        continue;
      }
      const color = misc.isUpperCase(ch) ? PieceColor.White : PieceColor.Black;
      let rank = null;
      switch (ch.toLowerCase()) {
        case "k":
          rank = PieceRank.King;
          break;
        case "q":
          rank = PieceRank.Queen;
          break;
        case "r":
          rank = PieceRank.Rook;
          break;
        case "n":
          rank = PieceRank.Knight;
          break;
        case "b":
          rank = PieceRank.Bishop;
          break;
        case "p":
          rank = PieceRank.Pawn;
          break;
        default:
          throw new Error(`Invalid FEN! Unknown character '${ch}'`);
      }
      const square: Square = rowNo * 8 + col;
      pieces[Squares[square]] = new Piece(color, rank, rowNo, col);

      if (rank == PieceRank.King)
        if (color == PieceColor.White) whiteKing = square;
        else blackKing = square;

      if (col > 7) throw new Error("Invalid FEN!\n" + FEN);
      col++;
    }
  }

  return {
    fen: FEN,
    enPassant: enPassantSquare,
    whiteKing: whiteKing,
    blackKing: blackKing,
    halfMove: halfMoveClock,
    fullMove: fullMoveClock,
    pieces: pieces,
    legalMoves: legalMoves,
    turn: turn,
    whiteShortCastle: castleAvailability.includes("K"),
    whiteLongCastle: castleAvailability.includes("Q"),
    blackShortCastle: castleAvailability.includes("k"),
    blackLongCastle: castleAvailability.includes("q"),
  } as BoardData;
};

export const getDefaultPositionBoardData = () => {
  return {
    fen: defaultFEN,
    enPassant: null,
    whiteKing: Square.e1,
    blackKing: Square.e8,
    halfMove: 0,
    fullMove: 1,
    turn: PieceColor.White,
    whiteShortCastle: true,
    whiteLongCastle: true,
    blackShortCastle: true,
    blackLongCastle: true,
    pieces: {
      a1: new Piece(PieceColor.White, PieceRank.Rook, 0, 0),
      b1: new Piece(PieceColor.White, PieceRank.Knight, 0, 1),
      c1: new Piece(PieceColor.White, PieceRank.Bishop, 0, 2),
      d1: new Piece(PieceColor.White, PieceRank.Queen, 0, 3),
      e1: new Piece(PieceColor.White, PieceRank.King, 0, 4),
      f1: new Piece(PieceColor.White, PieceRank.Bishop, 0, 5),
      g1: new Piece(PieceColor.White, PieceRank.Knight, 0, 6),
      h1: new Piece(PieceColor.White, PieceRank.Rook, 0, 7),

      a2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 0),
      b2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 1),
      c2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 2),
      d2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 3),
      e2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 4),
      f2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 5),
      g2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 6),
      h2: new Piece(PieceColor.White, PieceRank.Pawn, 1, 7),

      a7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 0),
      b7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 1),
      c7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 2),
      d7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 3),
      e7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 4),
      f7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 5),
      g7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 6),
      h7: new Piece(PieceColor.Black, PieceRank.Pawn, 6, 7),

      a8: new Piece(PieceColor.Black, PieceRank.Rook, 7, 0),
      b8: new Piece(PieceColor.Black, PieceRank.Knight, 7, 1),
      c8: new Piece(PieceColor.Black, PieceRank.Bishop, 7, 2),
      d8: new Piece(PieceColor.Black, PieceRank.Queen, 7, 3),
      e8: new Piece(PieceColor.Black, PieceRank.King, 7, 4),
      f8: new Piece(PieceColor.Black, PieceRank.Bishop, 7, 5),
      g8: new Piece(PieceColor.Black, PieceRank.Knight, 7, 6),
      h8: new Piece(PieceColor.Black, PieceRank.Rook, 7, 7),
    },
    legalMoves: {
      b1: new Set([Square.a3, Square.c3]),
      g1: new Set([Square.f3, Square.h3]),
      a2: new Set([Square.a3, Square.a4]),
      b2: new Set([Square.b3, Square.b4]),
      c2: new Set([Square.c3, Square.c4]),
      d2: new Set([Square.d3, Square.d4]),
      e2: new Set([Square.e3, Square.e4]),
      f2: new Set([Square.f3, Square.f4]),
      g2: new Set([Square.g3, Square.g4]),
      h2: new Set([Square.h3, Square.h4]),
    },
  } as BoardData;
};

export const boardDataToFEN = (data: BoardData) => {
  const ranks = Array<string>(8)
  for (let row = 0; row < 8; row++) {
    let rank = "", c = 0;
    for (let col = 0; col < 8; col++) {
      const square: Square = (row) * 8 + col;
      const piece = data.pieces[Squares[square]]
      if (piece) {
        if (c != 0) {
          rank += c.toString();
          c = 0;
        }
        const ch = piece.rank.toString()
        rank += (piece.color == PieceColor.White ? ch : ch.toLowerCase())
      }
      else c++;
    }
    if (c != 0) rank += c;
    ranks[row] = rank;
  }
  const fields = new Array<string>(6)
  fields[0] = ranks.join("/")
  fields[1] = data.turn == PieceColor.White ? "w" : "b";
  fields[2] = !(data.whiteShortCastle || data.whiteLongCastle || data.blackShortCastle || data.blackLongCastle) ? "-" :
    `${data.whiteShortCastle ? "K" : ""}${data.whiteLongCastle ? "Q" : ""}${data.blackShortCastle ? "k" : ""}${data.blackLongCastle ? "q" : ""}`;
  fields[3] = data.enPassant?.toString() ?? "-"
  fields[4] = data.halfMove.toString();
  fields[5] = data.fullMove.toString();
  return fields.join(" ")
}

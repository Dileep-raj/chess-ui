export function isAlpha(ch = "") { return /^[A-Z]$/i.test(ch); }

export function isDigit(n = "") { return /^[0-9]$/.test(n); }

export function isUpperCase(ch = "") { return /^[A-Z]$/.test(ch); }

export function isLowerCase(ch = "") { return /^[a-z]$/.test(ch); }

export function toNotation(row: number, col: number) { return String.fromCharCode(col + 97) + (row + 1); }

export function getFile(col: number) {
  if (col < 0 || col > 7)
    throw new Error(`Invalid column number: ${col}\nColumn number must be between 1-8`);
  return String.fromCharCode(col + 97);
}

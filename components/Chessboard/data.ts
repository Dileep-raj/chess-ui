export enum BoardTheme {
  default = "default",
  lichess = "lichess",
  grey = "grey",
  green = "green",
  brown = "brown",
  blue = "blue",
}

export type BoardThemeData = {
  name: string;
  light: string;
  dark: string;
}

export const BoardThemes: { [key in BoardTheme]: BoardThemeData } = {
  default: { name: "Default", light: "#dcc4aa", dark: "#A07655" },
  lichess: { name: "Lichess", light: "#F0D9B5", dark: "#B58863" },
  grey: { name: "Grey", light: "#e9e9e9", dark: "#666666" },
  green: { name: "Green", light: "#eeeed2", dark: "#769656" },
  brown: { name: "Brows", light: "#f1cca2", dark: "#aa6b40" },
  blue: { name: "Blue", light: "#CEE3F5", dark: "#3F698F" },
}

export interface BoardThemeOption {
  readonly label: string;
  readonly value: string;
}

export const boardThemeOptions: BoardThemeOption[] = Object.entries(BoardThemes).map(theme => { return { value: theme[0], label: theme[1].name } })

export interface GroupedOption {
  readonly label: string;
  readonly options: readonly BoardThemeOption[];
}

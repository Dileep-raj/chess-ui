export enum BoardTheme {
  default = "default",
  lichess = "lichess",
  grey = "grey",
  green = "green",
  brown = "brown",
  blue = "blue",
}

export interface BoardThemeOption {
  readonly label: string;
  readonly value: BoardTheme;
}

export const boardThemeOptions: BoardThemeOption[] = [
  { value: BoardTheme.default, label: "Default" },
  { value: BoardTheme.lichess, label: "Lichess" },
  { value: BoardTheme.green, label: "Green" },
  { value: BoardTheme.brown, label: "Brown" },
  { value: BoardTheme.blue, label: "Blue" },
  { value: BoardTheme.grey, label: "Grey" },
];

export interface GroupedOption {
  readonly label: string;
  readonly options: readonly BoardThemeOption[];
}

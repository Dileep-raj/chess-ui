import Select, { SingleValue, StylesConfig } from "react-select";
import { BoardThemeOption, GroupedOption, boardThemeOptions } from "./data";


interface BoardThemeSelectProps {
    onChange?: (option: SingleValue<BoardThemeOption>) => void;
    selected: BoardThemeOption;
}

const boardThemeSelectStyles: StylesConfig<
    BoardThemeOption,
    false,
    GroupedOption
> = {
    control: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-gray-900)",
        color: "var(--color-foreground)",
    }),
    singleValue: (styles) => ({ ...styles, color: "var(--color-foreground)" }),
    placeholder: (styles) => ({ ...styles, color: "var(--color-foreground)" }),
    input: (styles) => ({ ...styles, color: "var(--color-foreground)" }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isDisabled
            ? undefined
            : isSelected
                ? "#132233"
                : isFocused
                    ? "#fff"
                    : "#111",
        color: isDisabled
            ? "#bbb"
            : isSelected
                ? "white"
                : isFocused
                    ? "#000"
                    : "rgba(178, 248, 248, 1)",
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
            ...styles[":active"],
            backgroundColor: !isDisabled ? (isSelected ? "#564" : "#321") : undefined,
        },
    }),
};

const BoardThemeSelect = ({
    onChange,
    selected,
}: BoardThemeSelectProps) => (
    <Select<BoardThemeOption, false, GroupedOption>
        options={boardThemeOptions}
        onChange={onChange || undefined}
        value={selected}
        className="w-full md:w-64 lg:w-80 xl:w-80"
        placeholder="Select a board theme"
        styles={boardThemeSelectStyles}
    />
);

export default BoardThemeSelect;

export type DisplayColor = "Жёлтый" | "Зелёный" | "Красный" | "Not found";
// type ReverseDisplayColor = "YELLOW" | "GREEN" | "RED" | "Not found";
export type DisplayStep = "Ступень 1" | "Ступень 2" | "Ступень 3" | "Ступень 4"
// type ReverseDisplayStep = "Begin" | "Medium" | "High" | "Expert"
export type DisplayFunctional = "Волонтёр" | "Организатор";


export const colorMap: {"Жёлтый": string; "Зелёный": string; "Красный": string; "Not found": string;}  = {
    "Жёлтый": "YELLOW",
    "Зелёный": "GREEN",
    "Красный": "RED",
    "Not found": "Not found"
};

export const reverseColorMap: {"YELLOW": string, "GREEN": string, "RED": string, "Not found": string} = {
    "YELLOW": "Жёлтый",
    "GREEN": "Зелёный",
    "RED": "Красный",
    "Not found": "Not found"
};

export const stepMap = {
    "Ступень 1": "Begin",
    "Ступень 2": "Medium",
    "Ступень 3": "High",
    "Ступень 4": "Expert"
};

export const reverseStepMap : {"Begin": string, "Medium": string, "High": string, "Expert": string} = {
    "Begin": "Ступень 1",
    "Medium": "Ступень 2",
    "High": "Ступень 3",
    "Expert": "Ступень 4"
};

export const functionalMap: {"Волонтёр": string; "Организатор": string}  = {
    "Волонтёр": "VOLUNTEER",
    "Организатор": "ORG",
};

export const reverseFunctionalMap: {"VOLUNTEER": string; "ORG": string}  = {
    "VOLUNTEER": "Волонтёр",
    "ORG": "Органазитор",
};

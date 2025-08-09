export const convertStringArray = (values: string[]): number[] => values.map((v) => parseInt(v));

export const convertNumberArray = (values: number[]): string[] => values.map((v) => v.toString());

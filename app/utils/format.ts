export const formatInt = (value: number): string =>
  value.toLocaleString("en-GB");

export const formatFloat = (value: number, digits: number = 2): string =>
  value.toLocaleString("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

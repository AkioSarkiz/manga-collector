/**
 * Converts a string representation of a number with a suffix (K, M, B, T) to a numeric value.
 *
 * @param {string} numberString - The string representation of the number with a suffix.
 * @return {number} The numeric value of the input string.
 */
export const convertToNumber = (numberString: string): number => {
  const suffixes: { [key: string]: number } = {
    K: 1000,
    M: 1000000,
    B: 1000000000,
    T: 1000000000000,
  };

  const suffix = numberString.slice(-1).toUpperCase();
  const number = parseFloat(numberString.slice(0, -1));

  if (suffixes[suffix] !== undefined) {
    return number * suffixes[suffix];
  } else {
    return parseFloat(numberString);
  }
};

export const extractNumbersFromStrings = (input: string): number[] => {
  const regex = /\d+/g;
  const matches = input.match(regex);

  if (matches) {
    return matches.map(Number);
  } else {
    return [];
  }
};

export { extractChapterIndex } from "./chapter.js";
export { axios } from "./axios.js";

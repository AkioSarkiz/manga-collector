import { ManipulateType } from "dayjs";
import { dayjs } from "../lib/index.js";

/**
 * Checks if a given string consists only of numbers.
 *
 * @param {string} str - The string to be checked.
 * @return {boolean} Returns `true` if the string consists only of numbers,
 *                   else returns `false`.
 */
export const isOnlyNumbers = (str: string): boolean => {
  const pattern = /^\d+$/;

  return pattern.test(str);
};

/**
 * Parses a relative time string and returns a Dayjs object.
 *
 * @param {string} relativeTime - The relative time string to be parsed.
 * @return {dayjs.Dayjs} A Dayjs object representing the parsed relative time.
 */
export const parseRelativeTime = (relativeTime: string): dayjs.Dayjs => {
  try {
    const now = dayjs();

    const result = relativeTime.split(" ").slice(0, 2);

    const amount = Number(result[0]);
    const unit = result[1];

    if (isNaN(amount)) {
      throw new Error(`Invalid amount '${relativeTime}'`);
    }

    const singularUnit = (unit.endsWith("s") ? unit.slice(0, -1) : unit) as ManipulateType;
    const validUnits = ["second", "minute", "hour", "day", "week", "month", "year"];

    if (!validUnits.includes(singularUnit)) {
      throw new Error(`Invalid unit '${relativeTime}'`);
    }

    const parsedDate = now.subtract(amount, singularUnit);

    return parsedDate;
  } catch (error) {
    console.error(error);
    return dayjs();
  }
};

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

/**
 * Extracts numbers from a given string.
 *
 * @param {string} input - The input string from which numbers are to be extracted.
 * @return {number[]} An array of extracted numbers.
 */
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

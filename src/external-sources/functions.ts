import diacritics from "diacritics";

export function compareDiacriticsStrings(str1: string, str2: string): boolean {
  const normalizedStr1 = diacritics.remove(str1);
  const normalizedStr2 = diacritics.remove(str2);

  return normalizedStr1.toLowerCase() === normalizedStr2.toLowerCase();
}

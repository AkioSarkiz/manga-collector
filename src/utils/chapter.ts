/**
 * Extracts the chapter index from a given title.
 *
 * @param {string} title - The title of the chapter.
 * @return {number | undefined} The chapter index if found, otherwise undefined.
 */
export const extractChapterIndex = (title: string): number | undefined => {
  const match = title.match(/Chapter (\d+)/);

  return match ? parseInt(match[1], 10) : undefined;
};

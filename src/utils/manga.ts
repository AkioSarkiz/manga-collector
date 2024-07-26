import { ExternalSource } from "..";
import { MangaUpdatesClient } from "../lib/index.js";
import { ScrapedDetailedManga } from "../types/index.js";
import diacritics from "diacritics";

const compareDiacriticsStrings = (str1: string, str2: string): boolean => {
  const normalizedStr1 = diacritics.remove(str1);
  const normalizedStr2 = diacritics.remove(str2);

  return normalizedStr1 === normalizedStr2;
};

export const tryLinkMangaUpdatesData = async (manga: ScrapedDetailedManga): Promise<ScrapedDetailedManga> => {
  const client = new MangaUpdatesClient();

  const response = await client.searchSeries(manga.title);

  if (response.results.length === 0) {
    return manga;
  }

  for (let i = 0; i < 3 && i < response.results.length; i++) {
    const result = response.results[i];
    const series = await client.getSeriesById(result.record.series_id);

    const isTitleMatch = series.title.toLowerCase() === manga.title.toLowerCase();

    const isTitleMatchInAlternativeNames = series.associated
      .map((v) => v.title.toLowerCase())
      .some((formattedAssociatedTitle) =>
        compareDiacriticsStrings(formattedAssociatedTitle, manga.title.toLowerCase())
      );

    const isAuthorMatch = series.authors
      .map((seriesAuthor) => seriesAuthor.name.toLowerCase())
      .some((formattedSeriesAuthor) => {
        const formattedMangaAuthors = manga.authors?.map((v) => v.name.toLowerCase());

        return Boolean(
          formattedMangaAuthors?.some((formattedMangaAuthor) =>
            compareDiacriticsStrings(formattedMangaAuthor, formattedSeriesAuthor)
          )
        );
      });

    const isArtistMatch = series.authors
      .map((seriesAuthor) => seriesAuthor.name.toLowerCase())
      .some((formattedSeriesAuthor) => {
        const formattedMangaArtists = manga.artists?.map((artist) => artist.name.toLowerCase());

        return Boolean(
          formattedMangaArtists?.some((formattedMangaArtist) =>
            compareDiacriticsStrings(formattedMangaArtist, formattedSeriesAuthor)
          )
        );
      });

    const isMatch = (isAuthorMatch || isArtistMatch) && (isTitleMatch || isTitleMatchInAlternativeNames);

    if (isMatch) {
      if (!manga.externalSources) {
        manga.externalSources = [];
      }

      manga.externalSources.push({
        name: ExternalSource.MANGA_UPDATES,
        data: series,
      });

      break;
    }
  }

  return manga;
};

import { MangaUpdatesClient } from "../lib/index.js";
import {
  type ScrapedDetailedManga,
  ExternalSource,
  AbstractExternalSourceMatcher,
  ExternalSourceMatcher,
} from "../index.js";
import diacritics from "diacritics";

export class MangaUpdatesExternalSourceMatcher implements ExternalSourceMatcher {
  private readonly mangaUpdatesClient: MangaUpdatesClient;

  protected compareDiacriticsStrings(str1: string, str2: string): boolean {
    const normalizedStr1 = diacritics.remove(str1);
    const normalizedStr2 = diacritics.remove(str2);

    return normalizedStr1.toLowerCase() === normalizedStr2.toLowerCase();
  }

  public constructor(private readonly detailedManga: ScrapedDetailedManga) {
    // super();

    this.mangaUpdatesClient = new MangaUpdatesClient();
  }

  public async tryMatchExternalSource(): Promise<ScrapedDetailedManga> {
    const clonedDetailedManga = { ...this.detailedManga };
    const response = await this.mangaUpdatesClient.searchSeries(this.detailedManga.title);

    if (response.results.length === 0) {
      return clonedDetailedManga;
    }

    for (let i = 0; i < 3 && i < response.results.length; i++) {
      const result = response.results[i];
      const series = await this.mangaUpdatesClient.getSeriesById(result.record.series_id);

      const isTitleMatch = this.compareDiacriticsStrings(series.title, this.detailedManga.title);

      const isTitleMatchInAlternativeNames = series.associated
        .map((v) => v.title.toLowerCase())
        .some((formattedAssociatedTitle) =>
          this.compareDiacriticsStrings(formattedAssociatedTitle, this.detailedManga.title.toLowerCase())
        );

      const isAuthorMatch = series.authors
        .map((seriesAuthor) => seriesAuthor.name.toLowerCase())
        .some((formattedSeriesAuthor) => {
          const formattedMangaAuthors = this.detailedManga.authors?.map((v) => v.name.toLowerCase());

          return Boolean(
            formattedMangaAuthors?.some((formattedMangaAuthor) =>
              this.compareDiacriticsStrings(formattedMangaAuthor, formattedSeriesAuthor)
            )
          );
        });

      const isArtistMatch = series.authors
        .map((seriesAuthor) => seriesAuthor.name.toLowerCase())
        .some((formattedSeriesAuthor) => {
          const formattedMangaArtists = this.detailedManga.artists?.map((artist) => artist.name.toLowerCase());

          return Boolean(
            formattedMangaArtists?.some((formattedMangaArtist) =>
              this.compareDiacriticsStrings(formattedMangaArtist, formattedSeriesAuthor)
            )
          );
        });

      const isMatch = (isAuthorMatch || isArtistMatch) && (isTitleMatch || isTitleMatchInAlternativeNames);

      if (isMatch) {
        if (!clonedDetailedManga.externalSources) {
          clonedDetailedManga.externalSources = [];
        }

        clonedDetailedManga.externalSources.push({
          name: ExternalSource.MANGA_UPDATES,
          data: series,
          url: series.url,
        });

        break;
      }
    }

    return clonedDetailedManga;
  }
}

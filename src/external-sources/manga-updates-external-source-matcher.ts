import { MangaUpdatesClient } from "../lib/index.js";
import { ScrapedDetailedManga, ExternalSource } from "../index.js";
import diacritics from "diacritics";

export class MangaUpdatesExternalSourceMatcher {
  private readonly mangaUpdatesClient: MangaUpdatesClient;

  public constructor(private readonly detailedManga: ScrapedDetailedManga) {
    this.mangaUpdatesClient = new MangaUpdatesClient();
  }

  private compareDiacriticsStrings(str1: string, str2: string): boolean {
    const normalizedStr1 = diacritics.remove(str1);
    const normalizedStr2 = diacritics.remove(str2);

    return normalizedStr1 === normalizedStr2;
  }

  public async tryMatchExternalSource(): Promise<ScrapedDetailedManga> {
    const response = await this.mangaUpdatesClient.searchSeries(this.detailedManga.title);

    if (response.results.length === 0) {
      return this.detailedManga;
    }

    for (let i = 0; i < 3 && i < response.results.length; i++) {
      const result = response.results[i];
      const series = await this.mangaUpdatesClient.getSeriesById(result.record.series_id);

      const isTitleMatch = series.title.toLowerCase() === this.detailedManga.title.toLowerCase();

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
        if (!this.detailedManga.externalSources) {
          this.detailedManga.externalSources = [];
        }

        this.detailedManga.externalSources.push({
          name: ExternalSource.MANGA_UPDATES,
          data: series,
          url: series.url,
        });

        break;
      }
    }

    return this.detailedManga;
  }
}

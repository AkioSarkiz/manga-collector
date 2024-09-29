import { MangaUpdatesClient } from "../lib/index.js";
import { type ScrapedDetailedManga, type ExternalSourceMatcher } from "../index.js";
import { compareDiacriticsStrings } from "./functions.js";

export class MangaUpdatesExternalSourceMatcher implements ExternalSourceMatcher {
  private readonly mangaUpdatesClient: MangaUpdatesClient;

  public constructor(private readonly detailedManga: ScrapedDetailedManga) {
    this.mangaUpdatesClient = new MangaUpdatesClient();
  }

  public getSourceName(): string {
    return "manga-updates";
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

      const isTitleMatch = compareDiacriticsStrings(series.title, this.detailedManga.title);

      const isTitleMatchInAlternativeNames = series.associated
        .map((v) => v.title.toLowerCase())
        .some((formattedAssociatedTitle) =>
          compareDiacriticsStrings(formattedAssociatedTitle, this.detailedManga.title.toLowerCase()),
        );

      const isAuthorMatch = series.authors
        .map((seriesAuthor) => seriesAuthor.name.toLowerCase())
        .some((formattedSeriesAuthor) => {
          const formattedMangaAuthors = this.detailedManga.authors?.map((v) => v.name.toLowerCase());

          return Boolean(
            formattedMangaAuthors?.some((formattedMangaAuthor) =>
              compareDiacriticsStrings(formattedMangaAuthor, formattedSeriesAuthor),
            ),
          );
        });

      const isArtistMatch = series.authors
        .map((seriesAuthor) => seriesAuthor.name.toLowerCase())
        .some((formattedSeriesAuthor) => {
          const formattedMangaArtists = this.detailedManga.artists?.map((artist) => artist.name.toLowerCase());

          return Boolean(
            formattedMangaArtists?.some((formattedMangaArtist) =>
              compareDiacriticsStrings(formattedMangaArtist, formattedSeriesAuthor),
            ),
          );
        });

      const isMatch = (isAuthorMatch || isArtistMatch) && (isTitleMatch || isTitleMatchInAlternativeNames);

      if (isMatch) {
        if (!clonedDetailedManga.externalSources) {
          clonedDetailedManga.externalSources = [];
        }

        clonedDetailedManga.externalSources.push({
          name: this.getSourceName(),
          data: series,
          url: series.url,
        });

        break;
      }
    }

    return clonedDetailedManga;
  }
}

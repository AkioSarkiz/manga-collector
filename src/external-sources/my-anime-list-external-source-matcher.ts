import { type ScrapedDetailedManga, type ExternalSourceMatcher } from "../index.js";
import { Marika } from "@shineiichijo/marika";
import { compareDiacriticsStrings } from "./functions.js";

export class MyAnimeListExternalSourceMatcher implements ExternalSourceMatcher {
  private readonly marika: Marika;

  public constructor(private readonly detailedManga: ScrapedDetailedManga) {
    this.marika = new Marika();
  }

  public getSourceName(): string {
    return "my-anime-list";
  }

  public async tryMatchExternalSource(): Promise<ScrapedDetailedManga> {
    const clonedDetailedManga = { ...this.detailedManga };
    const { data } = await this.marika.manga.getMangaSearch({ q: this.detailedManga.title, page: 1 });

    if (data.length === 0) {
      return clonedDetailedManga;
    }

    for (let i = 0; i < 1 && i < data.length; i++) {
      const item = data[i];
      const manga = await this.marika.manga.getMangaById(item.mal_id);

      const isTitleMatch = compareDiacriticsStrings(manga.title, this.detailedManga.title);

      const isTitleMatchInAlternativeNames = manga.titles
        .map((v) => v.title)
        .some((formattedAssociatedTitle) =>
          compareDiacriticsStrings(formattedAssociatedTitle, this.detailedManga.title)
        );

      const isAuthorMatch = manga.authors
        .map((seriesAuthor) => seriesAuthor.name.replaceAll(",", ""))
        .some((formattedSeriesAuthor) => {
          const formattedMangaAuthors = this.detailedManga.authors?.map((v) => v.name);

          return Boolean(
            formattedMangaAuthors?.some((formattedMangaAuthor) =>
              compareDiacriticsStrings(formattedMangaAuthor, formattedSeriesAuthor)
            )
          );
        });

      const isArtistMatch = manga.authors
        .map((seriesAuthor) => seriesAuthor.name.replaceAll(",", ""))
        .some((formattedSeriesAuthor) => {
          const formattedMangaArtists = this.detailedManga.artists?.map((artist) => artist.name);

          return Boolean(
            formattedMangaArtists?.some((formattedMangaArtist) =>
              compareDiacriticsStrings(formattedMangaArtist, formattedSeriesAuthor)
            )
          );
        });

      const isMatch = (isAuthorMatch || isArtistMatch) && (isTitleMatch || isTitleMatchInAlternativeNames);

      if (isMatch) {
        if (!clonedDetailedManga.externalSources) {
          clonedDetailedManga.externalSources = [];
        }

        clonedDetailedManga.externalSources.push({
          name: this.getSourceName(),
          data: manga,
          url: manga.url,
        });

        break;
      }

      // Make troutle to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return clonedDetailedManga;
  }
}

import { type ScrapedDetailedManga, AbstractExternalSourceMatcher, ExternalSource } from "../index.js";
import { Marika } from "@shineiichijo/marika";

export class MyAnimeListExternalSourceMatcher extends AbstractExternalSourceMatcher {
  private readonly marika: Marika;

  public constructor(private readonly detailedManga: ScrapedDetailedManga) {
    super();

    this.marika = new Marika();
  }

  public async tryMatchExternalSource(): Promise<ScrapedDetailedManga> {
    const clonedDetailedManga = { ...this.detailedManga };
    const { data } = await this.marika.manga.getMangaSearch({ q: this.detailedManga.title, page: 1 });

    if (data.length === 0) {
      return clonedDetailedManga;
    }

    for (let i = 0; i < 3 && i < data.length; i++) {
      const item = data[i];
      const manga = await this.marika.manga.getMangaById(item.mal_id);

      const isTitleMatch = this.compareDiacriticsStrings(manga.title, this.detailedManga.title);

      const isTitleMatchInAlternativeNames = manga.titles
        .map((v) => v.title)
        .some((formattedAssociatedTitle) =>
          this.compareDiacriticsStrings(formattedAssociatedTitle, this.detailedManga.title)
        );

      const isAuthorMatch = manga.authors
        .map((seriesAuthor) => seriesAuthor.name)
        .some((formattedSeriesAuthor) => {
          const formattedMangaAuthors = this.detailedManga.authors?.map((v) => v.name);

          return Boolean(
            formattedMangaAuthors?.some((formattedMangaAuthor) =>
              this.compareDiacriticsStrings(formattedMangaAuthor, formattedSeriesAuthor)
            )
          );
        });

      const isArtistMatch = manga.authors
        .map((seriesAuthor) => seriesAuthor.name)
        .some((formattedSeriesAuthor) => {
          const formattedMangaArtists = this.detailedManga.artists?.map((artist) => artist.name);

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
          data: manga,
          url: manga.url,
        });

        break;
      }
    }

    return clonedDetailedManga;
  }
}

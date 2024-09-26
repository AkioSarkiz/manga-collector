export interface ExternalSourceMatcher {
  public tryMatchExternalSource(): Promise<ScrapedDetailedManga>;
}

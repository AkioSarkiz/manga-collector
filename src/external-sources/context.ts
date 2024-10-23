import { ExternalSourceStrategy, ScrapedDetailedManga } from "../types";

export class ExternalSourceContext {
  private strategy: ExternalSourceStrategy;

  public constructor(strategy: ExternalSourceStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: ExternalSourceStrategy) {
    this.strategy = strategy;
  }

  public async tryMatchExternalSource(): Promise<ScrapedDetailedManga> {
    return this.strategy.tryMatchExternalSource();
  }
}

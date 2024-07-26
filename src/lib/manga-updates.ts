import urlJoin from "url-join";
import { axios } from "./index.js";
import { AxiosInstance } from "axios";
import { SearchedSeriesResponse, SeriesResponse } from "../types";
import { decode } from "html-entities";

export class MangaUpdatesClient {
  private readonly baseUrl: string = "https://api.mangaupdates.com/v1";
  private readonly axios: AxiosInstance;

  private readonly config = {
    request_retry: 5,
  }

  public constructor() {
    this.axios = axios;
  }

  private getUrl(path: string = ""): string {
    return urlJoin(this.baseUrl, path);
  }

  public async getSeriesById(id: number): Promise<SeriesResponse> {
    let lastError: any = null;
    const url = this.getUrl(`series/${id}`);

    for (let i = 0; i < this.config.request_retry; i++) {
      try {
        const response = await this.axios.get(url);

        const serialResponse: SeriesResponse = response.data;

        serialResponse.associated = serialResponse.associated.map((v) => ({
          ...v,
          title: decode(v.title),
        }));

        return serialResponse;
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError;
  }

  public async searchSeries(query: string): Promise<SearchedSeriesResponse> {
    let lastError: any = null;
    const url = this.getUrl("series/search");

    for (let i = 0; i < this.config.request_retry; i++) {
      try {
        const response = await this.axios.post(url, {
          search: query,
        });

        return response.data;
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError;
  }
}

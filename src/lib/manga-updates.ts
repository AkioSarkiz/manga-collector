import urlJoin from "url-join";
import { axios } from "./index";
import { AxiosInstance } from "axios";
import { SearchedSeriesResponse, SeriesResponse } from "../types";
import { decode } from "html-entities";

export class MangaUpdatesClient {
  private readonly baseUrl: string = "https://api.mangaupdates.com/v1";
  private readonly axios: AxiosInstance;

  public constructor() {
    this.axios = axios;
  }

  private getUrl(path: string = ""): string {
    return urlJoin(this.baseUrl, path);
  }

  public async getSeriesById(id: number): Promise<SeriesResponse> {
    const url = this.getUrl(`series/${id}`);

    try {
      const response = await this.axios.get(url);

      const serialResponse: SeriesResponse = response.data;

      serialResponse.associated = serialResponse.associated.map((v) => ({
        ...v,
        title: decode(v.title),
      }));

      return serialResponse;
    } catch (e) {
      throw e;
    }
  }

  public async searchSeries(query: string): Promise<SearchedSeriesResponse> {
    const url = this.getUrl("series/search");

    try {
      const response = await this.axios.post(url, {
        search: query,
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

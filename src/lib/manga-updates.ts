import { AxiosInstance, AxiosRequestConfig } from "axios";
import { decode } from "html-entities";
import { urlJoin } from "../functions";
import type { SearchedSeriesResponse, SeriesResponse } from "../types";
import { axios } from "./index";

export class MangaUpdatesClient {
  private readonly baseUrl: string = "https://api.mangaupdates.com/v1";
  private readonly axios: AxiosInstance;

  private readonly config = {
    requestRetry: 5,
  };

  public constructor() {
    this.axios = axios;
  }

  private getUrl(path: string = ""): string {
    return urlJoin(this.baseUrl, path);
  }

  private async callRequest<T>(request: AxiosRequestConfig): Promise<T> {
    let lastError: unknown | null = null;

    for (let i = 0; i < this.config.requestRetry; i++) {
      try {
        const response = await this.axios.request(request);

        return response.data as T;
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError;
  }

  public async getSeriesById(id: number): Promise<SeriesResponse> {
    const requestConfig: AxiosRequestConfig = {
      method: "GET",
      url: this.getUrl(`series/${id}`),
    };

    const data = await this.callRequest<SeriesResponse>(requestConfig);

    data.associated = data.associated.map((v) => ({
      ...v,
      title: decode(v.title),
    }));

    return data;
  }

  public async searchSeries(query: string): Promise<SearchedSeriesResponse> {
    const requestConfig: AxiosRequestConfig = {
      method: "POST",
      url: this.getUrl("series/search"),
      data: {
        search: query,
      },
    };

    return await this.callRequest<SearchedSeriesResponse>(requestConfig);
  }
}

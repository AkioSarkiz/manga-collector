import { expectTypeOf, test } from "vitest";
import { MangaUpdatesClient } from "../../src/lib/index";
import { SearchedSeriesResponse } from "../../src";

test("should search series", async () => {
  const client = new MangaUpdatesClient();

  const result = await client.searchSeries("The Beginning After The End");

  expectTypeOf(result).toEqualTypeOf<SearchedSeriesResponse>();
});

---
sidebar_position: 3
title: External Sources
---

The manga collector supports external sources. Right now supported only one provider `manga-updates`.

Usage example

```js
import { MangaUpdatesExternalSourceMatcher } from "@akiosarkiz/manga-collector";

// It has to be detailed manga with type ScrapedDetailedManga.
const detailedManga = null;

// Create matcher instance
const matcher = new MangaUpdatesExternalSourceMatcher(detailedManga);

// Try to match detailed manga to external source data
const matchedDetailedManga = matcher.tryMatchExternalSource();

// See the result of matching. Sometimes it can be empty array 
// when matcher couldn't find the manga in the external source
console.log(matchedDetailedManga.externalSources)
```

---
sidebar_position: 3
title: External Sources
---

The manga collector supports external sources. Right now supported only one provider `manga-updates`.

Usage example

```js
import { ExternalSourceContext, MangaUpdatesStrategy, ScrapedDetailedManga } from "@akiosarkiz/manga-collector";

// It has to be detailed manga with type ScrapedDetailedManga.
const detailedManga: ScrapedDetailedManga = null;

// Create an instance of strategy
const strategy = new MangaUpdatesStrategy(detailedManga);

// Create an instance of context
const context = new ExternalSourceContext(strategy);

// Try to match detailed manga to external source data
const matchedDetailedManga = context.tryMatchExternalSource();

// See the result of matching. Sometimes it can be empty array 
// when matcher couldn't find the manga in the external source
console.log(matchedDetailedManga.externalSources)
```

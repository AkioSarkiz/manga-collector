---
sidebar_position: 1
title: Intro
---

# The manga-collector

[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

The manga-collector is a library designed to easily scrape manga content from various websites. This package is licensed under the MIT License and is fully test-covered.

## Features

- Scrapes manga chapters, titles, images, and other metadata.
- Supports multiple popular manga websites.
- Provides a simple and intuitive API for easy integration.

## Supported websites

The manga-collector currently supports the following manga websites (updating):

NOTE: By default github caches images, so it makes sense to turn off browser caching to see actual status

| **Website** |                                                                                                  **Status**                                                                                                  |
| :---------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Manganato  | [![Test scrape manganato](https://github.com/AkioSarkiz/manga-collector/actions/workflows/manganato-test.yml/badge.svg)](https://github.com/AkioSarkiz/manga-collector/actions/workflows/manganato-test.yml) |
|   Toonily   |    [![Test scrape toonily](https://github.com/AkioSarkiz/manga-collector/actions/workflows/toonily-test.yml/badge.svg)](https://github.com/AkioSarkiz/manga-collector/actions/workflows/toonily-test.yml)    |
|  Mangadex   |  [![Test scrape mangadex](https://github.com/AkioSarkiz/manga-collector/actions/workflows/mangadex-test.yml/badge.svg)](https://github.com/AkioSarkiz/manga-collector/actions/workflows/mangadex-test.yml)   |

## Requirements

- Node version 20.x and above

## How to install

```bash
npm install manga-collector
```

## Basic usage

This package contains examples of code that you can use and modify. They are located in `examples` folder.

Here is a simple example how you can use that package

```typescript
import { MangaScraperFactory, MangaSource } from "manga-collector";

const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);

console.log(await scraper.getDetailedManga("manga url here"));

// Example output
// {
//   "url": "https://chapmanganato.to/manga-fy982633",
//   "title": "Beauty And The Beasts",
//   "status": "ongoing",
//   "description": "As soon as she fell into the world of beast men, a leopard forcibly took her back to his home. Indeed, Bai Jingjing is at a complete and utter loss. The males in this world are all handsome beyond compare, while the women are all so horrid that even the gods shudder at their sight. As a first-rate girl from the modern world (she's even a quarter Russian), Bai Jingjing finds herself sitting at the center of a harem filled with beautiful men -- at the very peak of existence.",
//   "genres": [
//    ...
//   ],
//   "chapters": [
//     ...
//   ],
//   "authors": [
//     ...
//   ]
// }
```

## Available methods

| Method             | Description                  |
| ------------------ | ---------------------------- |
| getDetailedManga   | Get details of the manga     |
| getDetailedChapter | Get details of the chapter   |
| getLatestUpdates   | Get latest updates of mangas |
| search             | Find the mangas by query     |

## Contributing

Contributions are welcome! If you find any issues or would like to suggest enhancements, please submit a pull request or open an issue in the GitHub repository.

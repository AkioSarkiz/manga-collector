# The mangalib

[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

The mangalib is a library designed to easily scrape manga content from various websites. This package is licensed under the MIT License and is fully test-covered.

## Features

- Scrapes manga chapters, titles, images, and other metadata.
- Supports multiple popular manga websites.
- Provides a simple and intuitive API for easy integration.

## Supported websites

|        **Website**        | **Status** |
| :-----------------------: | :--------: |
|         Manganato         | no status  |
|          Toonily          | no status  |
|         Mangadex          | no status  |
| asuracomic (experimental) | no status  |

## Requirements

- Node version 20.x and above

### How to install

```bash
npm install mangalib
```

### How to use

TODO: update

```typescript
import { getLatestMangaList } from "manganato-scraper";

const result = await getLatestMangaList();

// an example result
// [
//    ...
//   {
//     title: 'Attack On Titan',
//     link: 'https://chapmanganato.to/manga-oa952283',
//     cover: 'https://avt.mkklcdnv6temp.com/34/b/1-1583465037.jpg',
//     rating: '4.5',
//     views: 'View : 106.5M'
//   },
//   {
//     title: 'Shingeki No Kyojin - Before The Fall',
//     link: 'https://chapmanganato.to/manga-vi952091',
//     cover: 'https://avt.mkklcdnv6temp.com/27/k/1-1583464768.jpg',
//     rating: '4.7',
//     views: 'View : 8M'
//   },
//   ...
// ]
```

### Available methods

| Method             | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| getLatestMangaList | Get latests manga from the website. This method supported pagination     |
| getNewestMangaList | Get newest manga from the website. This method supported pagination      |
| geHotMangaList     | Get hot\popular manga from the website. This method supported pagination |
| search             | Find the mangas by query. This method supported pagination               |
| getMangaDetails    | get details about the manga                                              |

## Supported Websites

The manga-lib currently supports the following manga websites (updating):

- nettruyen
- toonily
- blogtruyen
- asurascans
- mangadex

## Contributing

Contributions are welcome! If you find any issues or would like to suggest enhancements, please submit a pull request or open an issue in the GitHub repository.

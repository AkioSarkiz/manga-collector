import { Page } from "puppeteer";
import puppeteer from "puppeteer-extra";

import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

const injectJquery = async (page: Page) => {
  await page.addScriptTag({ url: "https://code.jquery.com/jquery-3.7.1.min.js" });
};


export { puppeteer, injectJquery };

import sha1 from "crypto-js/sha1";

import SiteRules from "./SiteRules";
import {Manga} from "@domains/Manga";
import {Page} from "@domains/Page";

export default class TelegraphRules implements SiteRules {
  constructor() {
    console.info("正在创建Telegraph规则");
  }

  async crawlManga(): Promise<Manga|null> {
    let referer = document.location.href;
    let hash = sha1(referer);
    let id = `tg-${hash}`;

    const header = document.getElementsByTagName("header")[0];
    const h1 = header.getElementsByTagName("h1")[0];

    let name = h1.innerText;

    return new Manga(id, name, referer);
  }

  async crawlPage(node: HTMLElement, mangaId: string, index: number, pageLength: number): Promise<Page|null> {
    const image: HTMLImageElement = node.getElementsByTagName("img")[0];
    const url = image.src;

    const startAt = url.lastIndexOf("/") + 1;
    const originFileName = url.substring(startAt);
    const extStartAt = originFileName.lastIndexOf(".") + 1;
    const extName = originFileName.substring(extStartAt);

    let pageNumber = `${index+1}`;
    if (pageNumber.length < pageLength) {
      const delta = pageLength - pageNumber.length;
      pageNumber = "0".repeat(delta) + pageNumber;
    }

    const fileName = `${pageNumber}.${extName}`;
    const page: Page = new Page(
      `${mangaId}-${pageNumber}`,
      mangaId,
      fileName,
      url,
      document.location.href
    );

    return page;
  }

  async crawlPages(mangaId: string): Promise<Page[]> {
    const pages: Page[] = [];
    const figures = document.getElementsByTagName("figure");
    const amount = figures.length;
    const pageLength = Math.floor(Math.log10(amount)+1);
    for (let index = 0; index < amount; index++) {
      const figure = figures[index];
      const page = await this.crawlPage(figure, mangaId, index, pageLength);
      if (page != null) {
        pages.push(page);
      }
    }
    return pages;
  }
}

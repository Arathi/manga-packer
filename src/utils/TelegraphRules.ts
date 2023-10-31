import SiteRules from "./SiteRules";
import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";
import sha1 from "crypto-js/sha1";

export default class TelegraphRules implements SiteRules {
  crawlManga(): Manga | null {
    let referer = document.location.href;
    let hash = sha1(referer);
    let id = `tg-${hash}`;

    const header = document.getElementsByTagName("header")[0];
    const h1 = header.getElementsByTagName("h1")[0];

    let name = h1.innerText;

    return new Manga(id, name, referer);
  }

  crawlPage(node: HTMLElement, mangaId: string, index: number, pageLength: number): Page | null {
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
      url
    );

    return page;
  }

  crawlPages(mangaId: string): Page[] {
    const pages: Page[] = [];
    const figures = document.getElementsByTagName("figure");
    const amount = figures.length;
    const pageLength = Math.floor(Math.log10(amount)+1);
    for (let index = 0; index < amount; index++) {
      const figure = figures[index];
      const page = this.crawlPage(figure, mangaId, index, pageLength);
      if (page != null) {
        pages.push(page);
      }
    }
    return pages;
  }
}

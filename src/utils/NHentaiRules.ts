import SiteRules from "./SiteRules";
import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";

export default class NHentaiRules implements SiteRules {
  crawlManga(): Manga | null {
    return null;
  }

  crawlPage(): Page | null {
    return null;
  }

  crawlPages(mangaId: string): Page[] {
    const pages: Page[] = [];

    return pages;
  }
}
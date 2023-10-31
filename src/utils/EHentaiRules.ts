import SiteRules from "./SiteRules";
import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";

export default class EHentaiRules implements SiteRules {
  crawlManga(): Manga | null {
    return null;
  }

  crawlPage(node: HTMLElement, mangaId: string, index: number, pageLength: number): Page | null {
    return null;
  }

  crawlPages(mangaId: string): Page[] {
    return [];
  }
}
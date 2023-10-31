import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";

export default interface SiteRules {
  crawlManga(): Manga | null;

  crawlPage(
    node: HTMLElement,
    mangaId: string,
    index: number,
    pageLength: number
  ): Page | null;

  crawlPages(mangaId: string): Page[];
}
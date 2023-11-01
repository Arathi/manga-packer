import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";

export default interface SiteRules {
  crawlManga(): Promise<Manga|null>;

  crawlPage(
    node: HTMLElement,
    mangaId: string,
    index: number,
    pageLength: number
  ): Promise<Page|null>;

  crawlPages(mangaId: string): Promise<Page[]>;
}
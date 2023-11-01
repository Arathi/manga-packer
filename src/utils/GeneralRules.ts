import SiteRules from "./SiteRules";
import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";

export default class GeneralRules implements SiteRules {
  async crawlManga(): Promise<Manga|null> {
    return null;
  }

  async crawlPage(node: HTMLElement, mangaId: string, index: number, pageLength: number): Promise<Page|null> {
    return null;
  }

  async crawlPages(mangaId: string): Promise<Page[]> {
    return [];
  }
}
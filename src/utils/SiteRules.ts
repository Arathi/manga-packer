import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";

export default interface SiteRules {
  crawlManga(): Manga | null;
  crawlPage(): Page | null;
  crawlPages(mangaId: string): Page[];
}
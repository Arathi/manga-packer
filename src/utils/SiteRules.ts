import {Manga} from "@domains/Manga";
import {Page} from "@domains/Page";

export default interface SiteRules {
  crawlManga(): Promise<Manga|null>;
  crawlPages(mangaId: string): Promise<Page[]>;
}
import SiteRules from "./SiteRules";
import {Manga} from "@domains/Manga";
import {Page} from "@domains/Page";
import {unsafeWindow} from "$";

interface Gallery {
  id: number;
  images: Images;
  media_id: string;

  num_pages: number;
  tags: Tag[];
  title: Titles;
}

interface Images {
  cover: Image;
  pages: Image[];
  thumbnail: Image;
}

interface Image {
  t: string;
  w: number;
  h: number;
}

interface Tag {
  id: number;
  type: string;
  name: string;
  url: string;
  count: number;
}

interface Titles {
  english: string;
  japanese: string;
  pretty: string;
}

interface NAppOptions {
  csrf_token: string;
  media_server: number;
}

export default class NHentaiRules implements SiteRules {
  constructor() {
    console.info("正在创建NHentai规则");
  }

  async crawlManga(): Promise<Manga|null> {
    // @ts-ignore
    const gallery = unsafeWindow._gallery as Gallery;

    let id = `nh-${gallery.id}`;
    let name = gallery.title.japanese;

    let referer = document.location.href;
    return new Manga(id, name, referer);
  }

  async crawlPages(mangaId: string): Promise<Page[]> {
    const pages: Page[] = [];

    const img: HTMLImageElement | null = document.querySelector("#thumbnail-container a img");
    if (img == null) {
      console.warn("未找到图片");
      return pages;
    }

    const src = img.dataset["src"];
    if (src == null) {
      console.warn("图片上没有data-src");
      return pages;
    }

    // @ts-ignore
    const gallery = unsafeWindow._gallery as Gallery;
    // @ts-ignore
    const options = unsafeWindow._n_app.options as NAppOptions;

    const amount = gallery.images.pages.length;
    const pageLength = Math.floor(Math.log10(amount)+1);
    let index = 0;

    for (const pi of gallery.images.pages) {
      let pageNumber = `${index+1}`;
      if (pageNumber.length < pageLength) {
        const delta = pageLength - pageNumber.length;
        pageNumber = "0".repeat(delta) + pageNumber;
      }

      let extName = "";
      switch (pi.t) {
        case "j":
          extName = "jpg"
          break;
        case "p":
          extName = "png";
          break;
        default:
          alert("未知的图片类型：" + pi.t);
          return pages;
      }

      const fileName = `${pageNumber}.${extName}`;
      const pageId = `${mangaId}-${pageNumber}`;
      const url = `https://i${options.media_server}.nhentai.net/galleries/${gallery.media_id}/${index+1}.${extName}`;
      const referer = `https://nhentai.net/g/${gallery.id}/${index+1}/`;

      const page = new Page(pageId, mangaId, fileName, url, referer);
      pages.push(page);

      index++;
    }

    return pages;
  }
}
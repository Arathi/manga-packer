import SiteRules from "./SiteRules";
import {Manga} from "@domains/Manga";
import {Page} from "@domains/Page";
import {unsafeWindow} from "$";

interface GTH {
  ct: CoverThumb;
  fl: FileList;
  th: Thumbs;
}

interface CoverThumb {
  cover: string;
  thumb: string;
}

type FileList = Record<number, string>;
type Thumbs = Record<string, string>;

interface Image {
  format: string;
  width: number;
  height: number;
}

export default class NHentaiXRules implements SiteRules {
  domain: string;

  constructor(domain = `nhentai.xxx`) {
    console.info(`正在创建NHentaiX规则，域名：${domain}`);
    this.domain = domain;
  }

  async crawlManga(): Promise<Manga|null> {
    const info = document.querySelector('.info');
    if (info === null) {
      console.warn(`未找到.info，漫画信息获取失败`);
      return null;
    }

    const h1 = info.querySelector('h1');
    if (h1 === null) {
      console.warn(`未找到主标题`);
      return null;
    }

    const galleryId = info.querySelector<HTMLSpanElement>('span.gallery_id');
    if (galleryId === null) {
      console.warn(`未找到Gallery ID`);
      return null;
    }

    const id = `nhx-${galleryId.innerText}`;
    const title = h1.innerText;
    const referer = document.location.href;

    return new Manga(
      id,
      title,
      referer,
    );
  }

  private parseImage(merged: string): Image | null {
    const splitted = merged.split(',');
    if (splitted.length !== 3) {
      console.error(`图片信息转换失败，无法拆分为三节！`, merged);
      return null;
    }
    
    const [format, widthStr, heightStr] = splitted;
    const width = parseInt(widthStr, 10);
    if (isNaN(width)) {
      console.warn(`图片信息缺失，宽度读取失败！`, merged);
    }

    const height = parseInt(heightStr, 10);
    if (isNaN(height)) {
      console.warn(`图片信息缺失，高度读取失败！`, merged);
    }

    return {
      format,
      width,
      height,
    }
  }

  async waitForGth(timeout: number = 5000): Promise<GTH> {
    return new Promise((resolve, reject) => {
      let startAt = new Date().getTime();
      const timer = setInterval(() => {
        // @ts-ignore
        const gth = unsafeWindow.g_th as GTH | undefined;
        const time = new Date().getTime();
        const duration = time - startAt;
        if (gth !== undefined) {
          console.info(`g_th 已加载，耗时 ${duration}ms`);
          clearInterval(timer);
          resolve(gth);
        }
        else if (duration >= timeout) {
          const message = `g_th 加载超时，已耗时 ${duration}ms`;
          console.warn(message);
          clearInterval(timer);
          reject(message);
        }
      }, 100);
    });
  }
  
  async crawlPages(mangaId: string): Promise<Page[]> {
    const pages: Page[] = [];

    // @ts-ignore
    const gth = await this.waitForGth(5000);
    const doc = unsafeWindow.document;

    const loadServerElement = doc.querySelector<HTMLInputElement>('#load_server');
    if (loadServerElement === null) {
      return pages;
    }
    const loadServer = parseInt(loadServerElement.value, 10);

    const loadDirElement = doc.querySelector<HTMLInputElement>('#load_dir');
    if (loadDirElement === null) {
      return pages;
    }
    const loadDir = loadDirElement.value;

    const galleryIdElement = doc.querySelector<HTMLInputElement>('#gallery_id');
    if (galleryIdElement === null) {
      return pages;
    }
    const galleryId = parseInt(galleryIdElement.value, 10);

    const loadIdElement = doc.querySelector<HTMLInputElement>('#load_id');
    if (loadIdElement === null) {
      return pages;
    }
    const loadId = loadIdElement.value;

    const loadPagesElement = doc.querySelector<HTMLInputElement>('#load_pages');
    if (loadPagesElement === null) {
      return pages;
    }
    const loadPages = parseInt(loadPagesElement.value);

    const referer = doc.location.href;

    const keys = Object.keys(gth.fl);
    const amount = keys.length;
    const pageLength = Math.floor(Math.log10(amount)+1);

    keys.forEach(key => {
      let pageIndex = parseInt(key);
      let pageNumber = `${key}`;
      const merged = gth.fl[pageIndex];
      const image = this.parseImage(merged);
      if (image === null) {
        return;
      }

      if (pageNumber.length < pageLength) {
        const delta = pageLength - pageNumber.length;
        pageNumber = "0".repeat(delta) + pageNumber;
      }

      const id = `${mangaId}-${pageNumber}`;

      let extName = "";
      switch (image.format) {
        case "j":
          extName = "jpg"
          break;
        case "p":
          extName = "png";
          break;
        default:
          alert("未知的图片类型：" + image.format);
          return;
      }

      const fileName = `${pageNumber}.${extName}`;
      const url = `https://i${loadServer}.nhentaimg.com/${loadDir}/${loadId}/${key}.${extName}`;

      const page = new Page(
        id,
        mangaId,
        fileName,
        url,
        referer,
      );
      pages.push(page);
    });

    console.debug(`页面信息加载完成：`, pages);
    return pages;
  }
}

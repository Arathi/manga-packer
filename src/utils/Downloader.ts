import {Page} from "../domains/Page";
import {Manga} from "../domains/Manga";
import {Status} from "../domains/types";

export default abstract class Downloader {
  db: LocalForage;
  manga: Manga | null;

  protected constructor(db: LocalForage) {
    this.db = db;
    this.manga = null;
  }

  async download(page: Page): Promise<boolean> {
    let blob: Blob | null = null;
    page.status = Status.Downloading;

    // 从缓存获取
    blob = await this.db.getItem<Blob>(page.id);
    if (blob != null) {
      console.info(`从缓存读取${page.id}的文件内容`, blob);
      page.total = page.loaded = blob.size;
      page.status = Status.Success;
      return true;
    }

    // 发送请求
    return await this.sendRequest(page);
  }

  abstract sendRequest(page: Page): Promise<boolean>;

  async getFromCache(page: Page): Promise<Blob | null> {
    return await this.db.getItem<Blob>(page.id);
  }

  async saveToCache(page: Page, blob: Blob): Promise<boolean> {
    const saved = await this.db.setItem(page.id, blob);
    return saved != null;
  }
}
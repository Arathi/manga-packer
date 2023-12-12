import Downloader from "./Downloader";
import {Page} from "@domains/Page";
import {Status} from "@domains/types";
import {GM} from "$";

export default class DownloaderXHR extends Downloader {
  constructor(db: LocalForage) {
    super(db);
  }

  override async sendRequest(page: Page): Promise<boolean> {
    let blob: Blob | null = null;
    GM.xmlHttpRequest({
      url: page.url,
      responseType: "blob",
      onprogress: (event) => {
        console.info(`${page.id}下载进度更新：${event.loaded}/${event.total}`);
        page.loaded = event.loaded;
        page.total = event.total;
      },
      onload: (event) => {
        console.info(`${page.id}下载完成`);
        page.status = Status.Success;
        blob = event.response as Blob;
        this.saveToCache(page, blob);
      },
    });
    return true;
  }
}
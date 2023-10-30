import {Page} from "../domains/Page";
import Axios, {AxiosInstance, AxiosProgressEvent} from "axios";
import LocalForage from "localforage";

export default class Downloader {
  axios: AxiosInstance;
  db: LocalForage;

  constructor(db: LocalForage) {
    this.axios = Axios.create();
    this.db = db;
    console.info("下载器构建完成");
  }

  async download(page: Page): Promise<Blob | null> {
    page.status = 1;
    let blob: Blob | null = null;

    const cache = await this.db.getItem<Blob>(page.id);
    if (cache != null) {
      console.info(`从缓存读取${page.id}的文件内容`, cache);
      page.total = page.loaded = cache.size;
      page.status = 2;
      return cache;
    }

    console.info(`开始下载：${page.url}`);
    const resp = await this.axios.get(page.url, {
      responseType: "blob",
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.loaded != undefined && progressEvent.total != undefined) {
          page.loaded = progressEvent.loaded;
          page.total = progressEvent.total;
          console.info(`${page.id}下载进度更新：${page.loaded}/${page.total}`);
        }
      },
    });

    if (resp.status != 200) {
      console.warn(`下载失败，状态码：${resp.status}，说明：${resp.statusText}`);
      return null;
    }

    // 获取blob
    blob = resp.data as Blob;
    console.info(`${page.id}下载完成：`, blob);
    page.total = page.loaded = blob.size;
    page.status = 2;

    // 写入缓存
    this.db.setItem(page.id, blob).then((img) => {
      console.info(`${page.id}文件内容（${img.size}）缓存成功！`);
    });

    return blob;
  }
}
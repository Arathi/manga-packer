import Axios, {AxiosHeaders, AxiosInstance, AxiosProgressEvent} from "axios";
import Downloader from "./Downloader";
import {Page} from "../domains/Page";
import {Status} from "../domains/types";

export default class DownloaderAxios extends Downloader {
  axios: AxiosInstance;

  constructor(db: LocalForage) {
    super(db);
    this.axios = Axios.create({});
    console.info("下载器(Axios)构建完成");
  }

  override async sendRequest(page: Page): Promise<boolean> {
    let headers = new AxiosHeaders();

    console.info(`开始下载：${page.url}`);
    const resp = await this.axios.get(page.url, {
      responseType: "blob",
      headers: headers,
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
      return false;
    }

    // 获取blob
    const blob = resp.data as Blob;
    console.info(`${page.id}下载完成：`, blob);
    page.status = Status.Success;
    page.loaded = page.total = blob.size;
    this.saveToCache(page, blob);

    return true;
  }
}
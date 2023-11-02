import SiteRules from "./SiteRules";
import {Manga} from "../domains/Manga";
import {Page} from "../domains/Page";
import Axios, {AxiosInstance} from "axios";
import {unsafeWindow} from "$";

const regexGallery = /\/g\/(\d+)\/([0-9a-f]+)/
const regexPage = /\/s\/([0-9a-f]+)\//

interface PageInfo {
  page: Page | null;
  nextToken: string | null;
}

interface GalleryMetadataResponse {
  gmetadata: GalleryMetadata[]
}

interface GalleryMetadata {
  title: string;
  title_jpn: string;
  filecount: number;
}

export default class EHentaiRules implements SiteRules {
  axios: AxiosInstance;
  metadata: GalleryMetadata | null = null;

  constructor() {
    this.axios = Axios.create({});
  }

  async crawlManga(): Promise<Manga|null> {
    const referer = document.location.href;
    const matcher = regexGallery.exec(referer);
    if (matcher == null) {
      console.warn("当前URL不符合规则");
      return null;
    }

    // @ts-ignore
    const apiURL: string = unsafeWindow.api_url;
    // @ts-ignore
    const galleryId: number = unsafeWindow.gid;
    // @ts-ignore
    const token: string = unsafeWindow.token;

    const reqBody = {
      method: 'gdata',
      gidlist: [[galleryId,token]]
    };

    const resp = await this.axios.post<GalleryMetadataResponse>(apiURL, reqBody);

    if (resp.status != 200) {
      console.warn(`漫画信息获取错误，状态码：${resp.status}`);
      return null;
    }

    const respData = resp.data;
    const gallery = respData.gmetadata[0];
    this.metadata = gallery;

    const id = `eh-${galleryId}`;
    return new Manga(id, gallery.title_jpn, referer);
  }

  async crawlPage(token: string, galleryId: number, index: number): Promise<PageInfo | null> {
    let page: Page | null = null;
    let nextToken: string | null = null;

    // @ts-ignore
    const apiURL: string = unsafeWindow.api_url;
    const url = `https://e-hentai.org/s/${token}/${galleryId}-${index}`;

    const resp = await this.axios.get(url);
    const html = resp.data;
    const doc = document.createElement("html");
    doc.innerHTML = html;

    const img: HTMLImageElement | null = doc.querySelector("img#img");
    if (img == null) {
      console.warn("图片节点获取失败！");
      return null;
    }

    const link: HTMLLinkElement | null = img.parentElement as HTMLLinkElement | null;
    if (link == null) {
      console.warn("链接节点获取失败！");
      return null;
    }

    const matcher = regexPage.exec(link.href);
    if (matcher == null) {
      console.warn("下一页URL不符合规则");
      return null;
    }

    if (link.href != url) {
      nextToken = matcher[1];
    }
    else {
      nextToken = null;
      console.info("已获取到最后一页");
    }

    const mangaId = `eh-${galleryId}`;

    let amount: number = 0;
    if (this.metadata != null) {
      amount = this.metadata.filecount;
    }
    const pageLength = Math.floor(Math.log10(amount)+1);

    let pageNumber = `${index}`;
    if (pageNumber.length < pageLength) {
      const delta = pageLength - pageNumber.length;
      pageNumber = "0".repeat(delta) + pageNumber;
    }

    const id = `${mangaId}-${pageNumber}`;
    const imgSrc = img.src;

    let dotIndex = imgSrc.lastIndexOf(".");
    let extName = imgSrc.substring(dotIndex);
    const fileName = `${pageNumber}${extName}`;

    page = new Page(
      id,
      mangaId,
      fileName,
      imgSrc,
      url
    );

    return {
      page,
      nextToken,
    } as PageInfo;
  }

  async crawlPages(mangaId: string): Promise<Page[]> {
    const pages: Page[] = [];
    const link: HTMLLinkElement | null = document.querySelector("#gdt div.gdtm a");
    if (link == null) {
      return pages;
    }

    const matcher = regexPage.exec(link.href);
    if (matcher == null) {
      console.warn("第一页URL不符合规则");
      return pages;
    }

    // @ts-ignore
    const galleryId: number = unsafeWindow.gid;

    let pageNumber = 0;
    let token: string | null = matcher[1];

    while (token != null) {
      const pageInfo = await this.crawlPage(token!!, galleryId, ++pageNumber);
      if (pageInfo != null) {
        pages.push(pageInfo.page!!);
        token = pageInfo.nextToken;
      }
      else {
        token = null;
      }
    }

    return pages;
  }
}
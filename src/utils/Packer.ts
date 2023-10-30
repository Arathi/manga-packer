import JSZip from "jszip";
import { Page } from "../domains/Page";

export default class Packer {
  db: LocalForage;

  constructor(db: LocalForage) {
    this.db = db;
    console.info("打包器构建完成");
  }

  async pack(pages: Page[]): Promise<Blob | null> {
    console.info(`正在打包${pages.length}张图片`);

    const zip = new JSZip();
    for (const page of pages) {
      const blob = await this.db.getItem<Blob>(page.id);
      if (blob == null) {
        console.warn(`${page.id}文件内容获取失败`);
        return null;
      }
      zip.file(page.fileName, blob);
    }

    return await zip.generateAsync({type: "blob"});
  }
}

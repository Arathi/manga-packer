import JSZip from "jszip";
import {Page} from "@domains/Page";
import {saveAs} from "file-saver";

export default class Packer {
  db: LocalForage;

  constructor(db: LocalForage) {
    this.db = db;
    console.info("打包器构建完成");
  }

  async pack(pages: Page[], pkgName: string) {
    console.info(`正在打包${pages.length}张图片`);

    const zip = new JSZip();
    for (const page of pages) {
      const blob = await this.db.getItem<Blob>(page.id);
      if (blob == null) {
        console.warn(`${page.id}文件内容获取失败`);
        return null;
      }
      zip.file(page.fileName, blob);
      console.info(`${page.fileName}已加入压缩包`);
    }

    console.info(`${pages.length}张图片打包完成`);
    // try {
    //   const blob = await zip.generateAsync({type: "blob"});
    //   return blob;
    // }
    // catch (ex) {
    //   console.error(`生成压缩包时出现异常：`, ex);
    // }
    // return null;

    // zip.generateAsync({type: "blob"}).then((blob) => {
    //   saveAs(blob, pkgName);
    // }).catch((reason) => {
    //   console.error(`打包时出现异常！`, reason);
    // });

    const stream = zip.generateInternalStream({type:'blob'});
    stream.accumulate().then((blob) => {
      console.info("压缩包生成完成！");
      saveAs(blob, pkgName);
    }).catch((reason) => {
      console.error(`打包时出现异常！`, reason);
    });
  }
}

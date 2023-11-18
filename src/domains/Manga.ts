export class Manga {
  id: string;
  name: string;
  referer: string;

  constructor(id: string, name: string, referer: string) {
    this.id = id;
    this.name = name;
    this.referer = referer;
  }

  get fileName(): string {
    // 过滤 / 替换
    // \ / : * ? " < > |
    const fileName = this.name
      .replaceAll("\\", "＼")
      .replaceAll("/", "／")
      .replaceAll(":", "：")
      .replaceAll("*", "＊")
      .replaceAll("?", "？")
      .replaceAll("\"", "＂")
      .replaceAll("<", "＜")
      .replaceAll(">", "＞")
      .replaceAll("|", "｜")
    ;
    return fileName;
  }
}
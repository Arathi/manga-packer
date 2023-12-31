import {Status} from "./types";

export class Page {
  id: string;
  mangaId: string;
  fileName: string;
  url: string;
  referer: string|null;
  status: Status;
  total: number;
  loaded: number;

  constructor(id: string, mangaId: string, fileName: string, url: string, referer: string|null) {
    this.id = id;
    this.mangaId = mangaId;
    this.fileName = fileName;
    this.url = url;
    this.referer = referer;
    this.status = Status.Pending;
    this.total = 0;
    this.loaded = 0;
  }

  get progress(): number {
    if (this.total > 0) {
      if (this.loaded < 0) return 0;
      if (this.loaded >= this.total) return 1;
      return this.loaded / this.total;
    }
    return 0;
  }
}

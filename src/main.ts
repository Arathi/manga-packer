import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import {unsafeWindow} from "$";

import SiteRules from "./utils/SiteRules";
import GeneralRules from "./utils/GeneralRules";
import TelegraphRules from "./utils/TelegraphRules";
import NHentaiRules from "./utils/NHentaiRules";
import Downloader from "./utils/Downloader";
import LocalForage from "localforage";
import Packer from "./utils/Packer";
import DownloaderXHR from "./utils/DownloaderXHR";
import EHentaiRules from "./utils/EHentaiRules";

const mountPoint = (() => {
  const node = document.createElement('div');
  node.id = "mgpk-app";
  document.body.append(node);
  return node;
})();

let db = LocalForage.createInstance({
  driver: LocalForage.INDEXEDDB,
  name: "manga-packer",
  version: 2,
  storeName: "image-cache",
  description: "MangaPacker图片Blob缓存"
});

let rules: SiteRules = new GeneralRules();
let downloader: Downloader | null = null;
let packer: Packer = new Packer(db);

const url = new URL(unsafeWindow.location.href);
console.info("url: ", url);
switch (url.host) {
  case "telegra.ph":
    rules = new TelegraphRules();
    downloader = new DownloaderXHR(db);
    break;
  case "nhentai.net":
    rules = new NHentaiRules();
    downloader = new DownloaderXHR(db);
    break;
  case "e-hentai.org":
    rules = new EHentaiRules();
    downloader = new DownloaderXHR(db);
    break;
  default:
    console.warn("others");
}

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.provide("rules", rules);
app.provide("downloader", downloader);
app.provide("packer", packer);

app.mount(mountPoint);

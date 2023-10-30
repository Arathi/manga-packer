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

const mountPoint = (() => {
  const node = document.createElement('div');
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
let downloader: Downloader = new Downloader(db);
let packer: Packer = new Packer(db);

const url = new URL(unsafeWindow.location.href);
console.info("url: ", url);
switch (url.host) {
  case "telegra.ph":
    console.info("telegraph");
    rules = new TelegraphRules();
    break;
  case "nhentai.net":
    console.info("nhentai");
    rules = new NHentaiRules();
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

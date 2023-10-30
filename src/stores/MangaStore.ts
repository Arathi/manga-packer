import {defineStore} from "pinia";
import { Manga } from "../domains/Manga";
import { Page } from "../domains/Page";

interface State {
  mangaList: Manga[],
  pageList: Page[],
}

export const useMangaStore = defineStore("manga", {
  state: () => ({
    mangaList: [],
    pageList: [],
  }),
  getters: {},
  actions: {},
});
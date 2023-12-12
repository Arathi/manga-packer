<script setup lang="ts">
import {computed, inject, onMounted, reactive, ref} from "vue";
import {saveAs} from "file-saver";

import SiteRules from "@utils/SiteRules";
import Downloader from "@utils/Downloader";
import Packer from "@utils/Packer";

import {Page} from "@domains/Page";
import {Manga} from "@domains/Manga";
import {Status} from "@domains/types";

import ProgressBar from "./ProgressBarEx.vue";
import TaskInfo from "./TaskInfo.vue";

// region props
interface Props {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 320,
  height: 540,
  backgroundColor: '#ccccff',
});
// endregion

// region inject
const rules = inject<SiteRules>("rules");
const downloader = inject<Downloader>("downloader");
const packer = inject<Packer>("packer");
// endregion

// region reactive
const manga = ref<Manga|null>(null);
const pages = reactive<Page[]>([]);
// endregion

onMounted(() => {
  fetch();
});

// region computed
const displayPages = computed(() => {
  // TODO 过滤
  // TODO 排序
  return pages;
});

const pageAmount = computed(() => pages.length);

const completedAmount = computed(() => {
  const completedPages = pages.filter(p => p.status == Status.Success);
  return completedPages.length;
});
// endregion

// region methods
/**
 * 获取任务
 */
async function fetch() {
  if (rules == undefined) {
    console.warn("无法载入站点规则！");
    return;
  }

  if (downloader == undefined) {
    console.warn("下载器注入失败！");
    return;
  }

  manga.value = await rules.crawlManga();
  if (manga.value == null) {
    console.warn("无法获取Manga信息！");
    return;
  }
  console.info("获取Manga信息：", manga.value);

  // 清空
  pages.length = 0;
  let results = await rules.crawlPages(manga.value.id);
  for (const page of results) {
    let cache = await downloader.getFromCache(page);
    if (cache != null) {
      if (cache.type != "text/html") {
        page.status = Status.Success;
        page.loaded = page.total = cache.size;
      }
      else {
        page.status = Status.Failure;
        page.loaded = page.total = cache.size;
      }
    }
    else {
      page.status = Status.Pending;
    }
  }

  pages.push(...results);
}

/**
 * 下载
 */
function download() {
  if (downloader == undefined) {
    console.warn("下载器注入失败！");
    return;
  }

  downloader.manga = manga.value;
  for (const page of pages) {
    downloader.download(page);
  }
}

/**
 * 打包
 */
function pack() {
  if (packer == undefined) {
    console.warn("打包器注入失败！");
    return;
  }

  if (manga.value == null) {
    console.warn("Manga信息获取失败！");
    return;
  }

  const mg: Manga = manga!!.value;
  packer.pack(pages).then((blob) => {
    if (blob == null) {
      console.warn("打包失败！");
      return;
    }
    saveAs(blob, `${mg.fileName}.zip`);
  });
}

/**
 * 打开设置窗口
 */
function openSettingDialog() {
}
// endregion
</script>

<template>
  <div class="task-list">
    <div class="group buttons">
      <button type="button" @click="download">下载</button>
      <button type="button" @click="pack">打包</button>
      <button type="button" @click="openSettingDialog">设置</button>
    </div>

    <div class="group progress-group">
      <progress-bar
        class="progress progress-overall"
        :min="0"
        :max="pageAmount"
        :value="completedAmount"
        :height="24"
      />
    </div>

    <div class="group tasks">
      <template v-for="page in pages">
        <task-info :page="page" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-list {
  position: fixed;
  right: 8px;
  top: 8px;

  width: v-bind('`${props.width}px`');
  height: v-bind('`${props.height}px`');
  background-color: v-bind(backgroundColor);
  padding: 8px;

  display: flex;
  flex-direction: column;

  border: 1px solid rgba(0, 0, 255, 1);
  border-radius: 8px;

  .group {
    margin-bottom: 8px;
  }
  .group:first-child {
    margin-top: 0;
  }

  .buttons {
    button {
      width: auto;
      height: 32px;
      margin-left: 8px;
    }
    button:first-child {
      margin-left: 0;
    }
  }

  .progress-group {
    .progress-overall {
      width: 100%;
      height: 20px;
    }

    .meter-all {
      width: 100%;
      height: 32px;
    }
  }

  .tasks {
    flex: 1;
    overflow-x: hidden;
  }
}

::-webkit-scrollbar {
  width: 3px;
  border-radius: 1px;
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 1px;
}
</style>
<script setup lang="ts">
import {computed, ref} from "vue";
import {Page} from "../domains/Page";
import ProgressBar from "./ProgressBarEx.vue";

interface Props {
  page: Page;
}

const props = defineProps<Props>();

const showDetails = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

const taskStatusClass = computed(() => {
  const classes: string[] = ['status'];

  return classes;
});

const statusColor = computed(() => {
  switch (props.page.status) {
    case 0:
      return "blue";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "red";
  }
  return "gray";
});

const statusText = computed(() => {
  switch (props.page.status) {
    case 0:
      return "等待";
    case 1:
      return "执行";
    case 2:
      return "成功";
    case 3:
      return "失败";
  }
  return "未知";
});

function onMouseEnter() {
  showDetails.value = true;
}

function onMouseLeave() {
  showDetails.value = false;
}
</script>

<template>
  <!-- 任务信息 -->
  <div class="task-info">
    <span>{{page.fileName}}</span>
    <span class="status" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      {{statusText}}
      <!-- 显示详情 -->
      <div class="task-info-details" v-show="showDetails">
        <div class="field">
          <div class="field-name">文件名：</div>
          <div class="field-value">{{page.fileName}}</div>
        </div>
        <div class="field">
          <div class="field-name">状态：</div>
          <div class="field-value">{{statusText}}</div>
        </div>
        <div class="field">
          <div class="field-name">已下载：</div>
          <div class="field-value">{{page.loaded}}</div>
        </div>
        <div class="field">
          <div class="field-name">文件大小：</div>
          <div class="field-value">{{page.total}}</div>
        </div>
      </div>
    </span>
    <progress-bar
      class="progress"
      :min="0"
      :max="page.total"
      :value="page.loaded"
    />
  </div>

</template>

<style scoped lang="scss">
.task-info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 28px;
  user-select: none;
  color: black;

  .status {
    position: relative;

    color: v-bind(statusColor);
    font-size: 0.75em;
    border: 1px solid v-bind(statusColor);
    border-radius: 20%;
    padding: 2px 4px;
    margin-left: 5px;
    margin-right: 5px;

    .task-info-details {
      display: flex;
      flex-direction: column;

      position: absolute;

      width: 200px;
      height: 96px;

      left: 40px;
      top: 0;

      background-color: gray;
      z-index: 10;
      opacity: 0.8;
      border-radius: 3%;
      padding: 5px;

      color: white;

      .field {
        display: flex;
        flex-direction: row;
        font-size: 1rem;

        .field-name {
          width: 100px;
        }
        .field-value {
          flex: 1;
        }
      }
    }
  }

  .progress {
    flex: 1;
  }
}
</style>
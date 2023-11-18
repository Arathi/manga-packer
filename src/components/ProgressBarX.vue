<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  min?: number;
  max?: number;
  value?: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderColor?: string;
  format?: (min: number, max: number, value: number) => string;
}>(), {
  min: 0,
  max: 100,
  value: 0,
  height: 20,
  backgroundColor: "gray",
  progressColor: "green",
  borderColor: "black",
  format: (min: number, max: number, value: number): string => {
    const delta = max - min;
    const actual = value - min;
    const percent = (actual * 100 / delta).toFixed(2);
    return `${actual}/${delta} (${percent}%)`;
  }
});

const radius = computed(() => props.height / 2);
</script>

<template>
  <div class="progress-bar">

  </div>
</template>

<style scoped lang="less">
.progress-bar {
  background-color: v-bind(bgColor);
  border: 1px solid v-bind(borderColor);
}
</style>
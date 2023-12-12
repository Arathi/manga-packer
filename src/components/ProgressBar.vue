<script setup lang="ts">
import {computed} from "vue";

interface Props {
  min?: number;
  max?: number;
  value?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  value: 0,
  height: 32,
});

const amount = computed(() => props.max - props.min);
const actual = computed(() => props.value - props.min);

const progress = computed(() => {
  if (amount.value <= 0) return 0;
  let p = actual.value / amount.value;
  if (p > 1) return 1;
  if (p < 0) return 0;
  return p;
});

const progressPercent = computed(() => {
  const percent = (progress.value * 100.0).toFixed(2);
  return `${actual.value}/${amount.value} (${percent}%)`;
});

const heightWithUnit = computed(() => `${props.height}px`);
const fontSize = computed(() => {
  return `${props.height / 40}em`;
});
</script>

<template>
  <div class="progress-bar">
    <progress
      :max="amount"
      :value="actual"
    />
    <div class="text">
      <span>{{progressPercent}}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  position: relative;
  height: v-bind(heightWithUnit);

  progress {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: v-bind(heightWithUnit);
  }

  .text {
    position: absolute;
    left: 0;
    top: 0;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: v-bind(heightWithUnit);

    span {
      font-size: v-bind(fontSize);
    }
  }
}
</style>
<script setup lang="ts">
import {computed} from 'vue';

interface Props {
  min?: number;
  max?: number;
  value?: number;
  height?: number;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  barColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  value: 0,
  height: 20,
  textColor: "#000000",
  backgroundColor: "#EFEFEF",
  borderColor: "#CBCBCB",
  barColor: "#107C10",
});

const progress = computed(() => {
  let actualMax = props.max - props.min;
  let actualValue = props.value - props.min;
  if (actualMax == 0) return 0;
  return actualValue / actualMax;
});

const percent = computed(() => {
  return `${(progress.value*100).toFixed(2)}%`;
});

const progressText = computed(() => {
  return `${props.value}/${props.max} (${percent.value})`;
});

const heightPx = computed(() => `${props.height}px`);
const radiusPx = computed(() => `${props.height/2}px`);
</script>

<template>
  <div class="progress-bar">
    <div class="container">
      <div class="background">
        <div class="clip">
          <div class="bar"></div>
        </div>
      </div>
      <div class="text">
        <span>{{progressText}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$height: v-bind(heightPx);

.progress-bar {
  width: 100%;
  height: $height;
  .container {
    position: relative;
    .background {
      position: absolute;
      width: 100%;
      height: $height;
      background-color: v-bind(backgroundColor);
      border: 1px solid v-bind(borderColor);
      border-radius: v-bind(radiusPx);
      .clip {
        clip-path: inset(0 round v-bind(radiusPx));
        .bar {
          width: v-bind(percent);
          height: $height;
          background-color: v-bind(barColor);
        }
      }
    }
    .text {
      position: absolute;
      width: 100%;
      height: $height;
      left: 1px;
      top: 1px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      span {
        font-size: 0.8em;
        color: v-bind(textColor);
      }
    }
  }
}
</style>

<script setup lang="ts">
interface Option {
  text: string;
  value: string;
}

interface Props {
  color: string;
  options: Option[];
}

const props = defineProps<Props>();
</script>

<template>
  <div class="check-box-group">
    <template v-for="option in options">

    </template>
  </div>
</template>

<style scoped lang="less">

</style>
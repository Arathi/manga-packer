<script setup lang="ts">
interface Props {
  name: string;
  value: string;
  label: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="check-box">
    <input
      type="checkbox"
      :name="name"
      :value="value"
    />
    <label>{{label}}</label>
  </div>
</template>

<style scoped lang="less">

</style>
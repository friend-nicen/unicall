<template>
  <div :style="{
    color:activeColor.color,
    backgroundColor:activeColor.bgColor}"
       class="status-badge">
    <slot/>
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  color: {
    required: false,
    default: 0
  }
});

const colors = {
  0: {
    color: "#cf1322",
    bgColor: "#fff1f0"
  },
  1: {
    color: "#f57c00",
    bgColor: "#fff3e0"
  },
  2: {
    color: "#389e0d",
    bgColor: "#f6ffed"
  },
  3: {
    color: "#0958d9",
    bgColor: "#e6f4ff"
  },
  4: {
    color: "#08979c",
    bgColor: "#e6fffb"
  },
}

const activeColor = computed(() => {
  if (props.color in colors) {
    return colors[props.color]
  } else {
    return colors[0];
  }
})
</script>

<style lang="scss" scoped>
/* 状态标签 */
.status-badge {
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
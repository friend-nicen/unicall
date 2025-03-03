<template>
  <span class="tag">
    <slot></slot>
  </span>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.tag {
  color: white;
  outline: none;
  border: none;

  padding: 2px 6px;
  font-size: $font-size-4;
  border-radius: 30px;
  background-color: $primary-color;

  &:active {
    background-color: $active-color;
  }
}
</style>
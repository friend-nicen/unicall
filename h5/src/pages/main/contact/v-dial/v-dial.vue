<template>

  <van-popup
      :show="visible"
      round
      position="bottom"
      teleport="body"
      :overlay="false"
      class="self-popup self-dial"
      :style="{ height: 'fit-content' }"
  >

    <div class="dial-panel">

      <div :style="{height:(phone.length > 0)?'50px':0}" class="show-number">
        <span class="phone-number">
          {{ phone }}
        </span>
        <span @click="backspace" class="icon icon-shanchu2"></span>
      </div>

      <div class="pane">
        <template v-for="(number) of [1,2,3,4,5,6,7,8,9,'*',0,'#']" :key="number">
          <div class="phone-index" @click="append(number)">
            <span class="alabo">  {{ number }}</span>
          </div>
        </template>
      </div>


      <div class="button">
        <van-space :size="20">


          <van-button @click="phone = ''" style="padding: 0 18px" plain hairline size="small" type="primary">清空
          </van-button>


          <van-button @click="dialPhone({mobile:phone},false)"
                      style="padding: 0 18px"
                      plain
                      hairline
                      size="small"
                      type="primary">
            拨号
          </van-button>

          <van-button @click="close" style="padding: 0 18px" plain hairline size="small" type="primary">关闭
          </van-button>


        </van-space>

      </div>

    </div>

  </van-popup>
</template>

<script setup>
/* eslint-disable */

import {inject, ref} from "vue";

const props = defineProps(['visible']);
const emit = defineEmits(['update:visible']);

/* 关闭窗口 */
const close = () => {
  emit('update:visible', false);
}

const phone = ref("");

const append = (alabo) => {
  phone.value += alabo;
}

const backspace = () => {
  phone.value = phone.value.slice(0, -1);
}

/* 拨号的方法 */
const dialPhone = inject('dialPhone');
</script>

<style lang="scss" scoped>

:global(.self-dial) {
  box-shadow: $sidebar-shadow;
}

.dial-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;


  .show-number {
    @include flex-center;
    position: relative;
    overflow: hidden;
    transition-property: height;
    transition-duration: 0.3s;
    box-sizing: border-box;
    height: 70px;
    width: 90%;

    .phone-number {
      color: $primary-color;
      font-size: 24px;
      font-weight: bold;
      padding-top: 20px;
    }

    .icon {
      position: absolute;
      font-size: 24px;
      padding-top: 20px;
      color: $sub-text-color;
      right: 5px;

      &:active {
        color: #000000;
      }
    }
  }

  .pane {
    width: 85%;
    padding: 10px 0 0;
    @include flex-center;
    justify-content: space-between;
    flex-wrap: wrap;

    .phone-index {
      @include flex-center;
      width: 33.3%;

      &:active {
        .alabo {
          background-color: #E1E1E1;
        }
      }

      .alabo {
        @include flex-center;
        border-radius: 50%;
        font-weight: bold;
        font-size: 21px;
        width: 60px;
        height: 60px;


      }


    }


  }

  .button {
    padding: 10px 0 20px;
  }
}
</style>

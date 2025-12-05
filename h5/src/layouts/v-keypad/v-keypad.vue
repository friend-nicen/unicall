<template>
  <van-popup
      v-model:show="visible"
      :close-on-click-overlay="false"
      position="bottom" round
      safe-area-inset-bottom>

    <!--  键盘  -->
    <div class="keypad">
      <div v-if="phone" class="display">
        <input ref="inputEl" v-model="phone" class="input" type="tel"/>
        <span ref="btn" class="icon icon-shanchu2 shanchu" @click.capture.stop="backspace"></span>
      </div>
      <div class="grid">
        <div v-for="k in keys" :key="k.main" class="cell" @pointerdown.capture.stop="tap(k)" @click.stop.prevent>
          <span class="main">{{ k.main }}</span>
          <span v-if="k.sub" class="sub">{{ k.sub }}</span>
        </div>
      </div>
      <div class="footer">
        <van-icon class="opt" name="bars" @click="showOptions = true"/>
        <div class="center-actions">
          <button :disabled="!canCall" class="call" @click="doCall">
            <van-icon name="phone-o"/>
            立即拨打
          </button>
        </div>
        <span class="icon icon-yincangjianpan yincang" @click="visible = false"></span>
      </div>
    </div>

  </van-popup>

  <!-- 弹出框 -->
  <van-popup v-model:show="showOptions" :style="{height: '38%'}" closeable position="bottom" round
             safe-area-inset-bottom>
    <div class="call-set">
      <van-cell-group inset>
        <van-cell title="拨号后自动清空拨号盘">
          <template #right-icon>
            <van-switch v-model="autoClearAfterDial" size="22px"/>
          </template>
        </van-cell>
        <van-cell title="拨号后自动添加客户">
          <template #right-icon>
            <van-switch v-model="autoAddAfterDial" size="22px"/>
          </template>
        </van-cell>
        <van-cell title="仅接通后再添加">
          <template #right-icon>
            <van-switch v-model="addOnlyWhenConnected" size="22px"/>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </van-popup>


</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {onLongPress, useLocalStorage} from '@vueuse/core';
import call from '@/utils/call';

const props = defineProps({show: {type: Boolean, default: false}})
const emit = defineEmits(['update:show'])

const visible = ref(false)
watch(() => props.show, v => visible.value = v, {immediate: true})
watch(visible, v => emit('update:show', v))

/* 长按清空 */
const btn = ref();
onLongPress(btn, () => {
  phone.value = "";
});

const phone = ref('');
const inputEl = ref(null);

const keys = [
  {main: '1', sub: ''},
  {main: '2', sub: 'ABC'},
  {main: '3', sub: 'DEF'},
  {main: '4', sub: 'GHI'},
  {main: '5', sub: 'JKL'},
  {main: '6', sub: 'MNO'},
  {main: '7', sub: 'PQRS'},
  {main: '8', sub: 'TUV'},
  {main: '9', sub: 'WXYZ'},
  {main: '*', sub: ''},
  {main: '0', sub: '+'},
  {main: '#', sub: ''}
]


const tap = (k) => {
  const ch = k.main === '0' && k.sub === '+' ? '0' : k.main
  phone.value = phone.value + ch;
}

const backspace = () => {
  phone.value = phone.value.slice(0, -1)
}

/* 拨号 */
const doCall = () => {
  const raw = phone.value.replace(/\s+/g, '')
  if (!raw || !/^\+?\d+$/.test(raw)) return
  call({
    phone: raw,
    dial: 0,
    last_call: null,
    name: raw
  }, {
    autoAddAfterDial: autoAddAfterDial.value,
    addOnlyWhenConnected: addOnlyWhenConnected.value
  });
  if (autoClearAfterDial.value) {
    phone.value = "";
  }
}

/* 状态 */
const canCall = computed(() => /^\+?\d+$/.test(phone.value))
const showOptions = ref(false);

/* 设置 */
const autoAddAfterDial = useLocalStorage('autoAddAfterDial', false);
const addOnlyWhenConnected = useLocalStorage('addOnlyWhenConnected', true);
const autoClearAfterDial = useLocalStorage('autoClearAfterDial', true);
</script>

<style lang="scss" scoped>
.keypad {
  padding: 18px 14px 10px;

  .display {
    position: relative;
    padding: 8px 12px 0;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    .shanchu {
      background-color: #ffffff;
      position: absolute;
      color: #d5d5d5;
      font-size: 32px;
      padding: 0 10px;
      right: 0;
      top: 50%;
      transform: translateY(calc(-50% + 4px));
    }

    .input {
      width: 100%;
      height: 40px;
      border: none;
      background: transparent;
      text-align: center;
      color: $primary-color;
      font-weight: 700;
      font-size: 26px;
      letter-spacing: 2px;
    }

    .del {
      margin-left: 10px;
      font-size: 22px;
      color: #666;
    }
  }

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 12px 8px 18px;

    .cell {
      @include flex-center;
      flex-direction: column;
      border-radius: 37px;
      width: 100%;
      height: 74px;
      background: #fff;
      margin: 0 auto;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;

      &:active {
        background-color: #f5f5f5;
      }

      .main {
        font-size: 22px;
        font-weight: 700;
        color: #000;
      }

      .sub {
        font-size: 10px;
        color: #6f6f6f;
      }
    }
  }

  .footer {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 10px 20px 8px;

    .opt {
      justify-self: start;
      font-size: 25px;
      color: #333;
    }

    .yincang {
      justify-self: end;
      color: #333;
      font-size: 25px;
    }

    .center-actions {
      @include flex-center;
      align-items: center;

      .call {
        @include flex-center;
        height: 42px;
        width: 60%;
        border-radius: 30px;
        background-color: $primary-color;
        color: #fff;
        border: 1px solid #eaeaea;
        font-size: 14px;

        .van-icon {
          margin-right: 6px;
        }
      }
    }
  }

}

.call-set {
  padding: 48px 12px 32px;

  :deep(.van-cell-group) {
    background: #fff;
    border-radius: 12px;
  }

  :deep(.van-cell) {
    padding: 14px 12px;
  }

  :deep(.van-cell__title) {
    font-size: 14px;
    color: #333;
  }

  :deep(.van-switch) {
    vertical-align: middle;
  }
}
</style>

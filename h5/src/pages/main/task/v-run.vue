<template>
  <van-popup
      v-model:show="visible.run"
      :close-on-click-overlay="false"
      closeable position="bottom"
      round>
    <div class="run-dialog">
      <div :style="{ visibility : phone ? 'visible' : 'hidden'}" class="number">
        <van-icon name="phone-o"/>
        <span class="num">{{ phone }}</span>

      </div>

      <div class="actions">
        <van-button :loading="stopping" class="sm-btn" loading-text="正在终止" plain round size="small" type="danger"
                    @click="stop">不打了（{{ task.index }}/{{ task.total }}）
        </van-button>
        <van-button class="sm-btn" round size="small" type="primary" @click="countdown = 0">
          {{ countdown > 0 ? `继续拨打(${countdown}s)` : '继续拨打' }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import {ref, watch, onUnmounted} from 'vue'
import {injects, sleep} from '@/common'
import call from "@/utils/call";
import load from "@/common/load";

/* 注入的 */
const {
  visible,
  runningTask: task
} = injects([
  'visible',
  'runningTask'
])

/* 解析号码 */
const parsePhones = (val) => {
  return (val || '')
      .split(/\r?\n|\s+/)
      .map(s => s.replace(/[^\d]/g, ''))
      .filter(Boolean)
}


/* 倒计时 */
const countdown = ref(0);
const stopping = ref(false);
const phone = ref(null);

/* 状态 */
let phones = [], running = false;

/* 停止拨号 */
const stop = () => {
  stopping.value = true;
  running = false;
}


/* 拨号 */
const start = async () => {
  try {

    /* 标记 */
    running = true;
    countdown.value = task.value.interval;
    stopping.value = false;
    phone.value = null;

    /* 开始循环 */
    while (task.value.index < task.value.total && running) {

      /* 倒计时 */
      phone.value = phones[task.value.index];

      /* 倒计时 */
      while (countdown.value > 0) {
        await sleep(1000);
        countdown.value = countdown.value - 1;
        if (!running) {
          visible.run = false;
          return;
        }
      }

      /* 倒计时 */
      countdown.value = task.value.interval;

      /* 客户信息 */
      const cust = {
        phone: phones[task.value.index],
        pick: 0
      }

      /* 拨号 */
      await call(cust, {
        task: task.value.id,
        autoAddAfterDial: task.value.auto,
        addOnlyWhenConnected: task.value.answer
      })

      /* 已拨打 */
      task.value.call += 1;

      /* 接通 */
      if (cust.pick > 0) task.value.pick += 1

      /* 递增 */
      task.value.index++;
    }

    /* 结束 */
    visible.run = false;
  } catch (e) {
    load.toast(e);
  }
}


/* 监听 */
watch(() => visible.run, (val) => {
  if (val && task.value) {
    phones = parsePhones(task.value.phone);
    start();
  } else {
    stop();
  }
})

onUnmounted(() => {
  stop()
});
</script>

<style lang="scss" scoped>
.run-dialog {
  padding: 15px 10% 35px;
  display: flex;
  flex-direction: column;

  .number {
    @include flex-center;
    font-size: 24px;
    font-weight: bold;
    margin: 35px 0 27px;
    text-align: center;
    letter-spacing: 2px;
    margin-left: -10px;
    gap: 10px;

    .tip {
      text-align: center;
      font-size: 10px;
      color: #8a8d93;
    }

    .van-icon {
      font-size: 28px;
    }
  }


  .badge-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .badge {
      background-color: #f7f7f7;
      border: 1px solid #efefef;
      border-radius: 12px;
      font-size: 12px;
      color: #666;
      padding: 4px 10px;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    margin-top: 12px;
    width: 100%;
    gap: 18px;

    .sm-btn {
      height: 38px;
      width: 45%;
    }
  }
}
</style>

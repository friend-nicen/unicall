<template>

  <van-popup
      v-model:show="show"
      :style="{ width: '80%',height:'100%' }"
      closeable
      position="right"
      round
      safe-area-inset-bottom
  >

    <div class="filter">

      <div class="body">
        <div class="title">标签</div>
        <ul class="option">
          <template v-for="item of labels" :key="item.value">
            <li :class="{active:used.condition.labels.indexOf(item.value) > -1}" class="label"
                @click="toggleLabel(item.value)">
              {{ item.label }}
            </li>
          </template>
        </ul>
        <div class="title">客户状态</div>
        <ul class="option">
          <template v-for="(item) of status" :key="item.value">
            <li :class="{active : used.condition.status === item.value}" class="label"
                @click="toggleStatus(item.value)">
              {{ item.label }}
            </li>
          </template>
        </ul>
        <div class="title">客户意向</div>
        <ul class="option">
          <template v-for="(item) of intent" :key="item.value">
            <li :class="{active : used.condition.intent === item.value}" class="label"
                @click="toggleIntent(item.value)">
              {{ item.label }}
            </li>
          </template>
        </ul>
        <div class="title">通话次数</div>
        <ul class="option">
          <template v-for="(item) of calls" :key="item.value">
            <li :class="{active : used.condition.calls === item.value}" class="label"
                @click="toggleCalls(item.value)">
              {{ item.label }}
            </li>
          </template>
        </ul>
        <div class="title">接听次数</div>
        <ul class="option">
          <template v-for="(item) of pickOptions" :key="item.value">
            <li :class="{active : used.condition.pick === item.value}" class="label"
                @click="togglePick(item.value)">
              {{ item.label }}
            </li>
          </template>
        </ul>
        <div class="title">排序方式</div>
        <ul class="option">
          <template v-for="(item,index) of ['按分配时间','按导入时间','按上次拨号']" :key="item">
            <li :class="{active:used.condition.order === index+1}" class="label"
                @click="used.condition.order=index+1">
              {{ item }}
            </li>
          </template>
        </ul>
        <div class="title">排序方向</div>
        <ul class="option">
          <template v-for="(item,index) of ['从早到晚','从晚到早']" :key="item">
            <li :class="{active:used.condition.direct === index+1}" class="label"
                @click="used.condition.direct=index+1">
              {{ item }}
            </li>
          </template>
        </ul>
        <div class="title">客户名称</div>
        <van-field v-model="used.condition.name" placeholder="输入客户名称搜索"/>
        <div class="title">客户手机号</div>
        <van-field v-model="used.condition.phone" placeholder="输入手机号搜索"/>
      </div>

      <div class="footer">
        <van-button class="button reset" plain round size="small" type="primary" @click="reset">重置</van-button>
        <van-button class="button" plain round size="small" type="primary" @click="filter">筛选</van-button>
      </div>
    </div>
  </van-popup>

</template>

<script setup>
import {reactive, watch} from "vue";
import {cloneDeep} from "lodash";
import {injects} from "@/common";

/* 自定义事件 */
const emit = defineEmits(['query']);

/* 通话次数 */
const calls = [
  {
    label: "从未通话",
    value: 0
  },
  {
    label: "大于1次",
    value: 1
  },
  {
    label: "大于3次",
    value: 3
  }
];

/* 通话次数 */
const pickOptions = [
  {
    label: "从未接听",
    value: 0
  },
  {
    label: "大于1次",
    value: 1
  },
  {
    label: "大于3次",
    value: 3
  }
];

/* 数据 */
const {
  labels,
  condition,
  intent,
  status,
  visible_filter: show
} = injects([
  'labels',
  'condition',
  'status',
  'intent',
  'visible_filter'
])

/* 当前状态 */
const used = reactive({
  condition: cloneDeep(condition.data)
});


/**
 * 添加删除标签
 * @param item
 */
const toggleLabel = (item) => {
  const index = used.condition.labels.indexOf(item);
  if (index === -1) {
    used.condition.labels.push(item);
  } else {
    used.condition.labels.splice(index, 1);
  }
}


/**
 * 切换接听次数
 * @param item
 */
const togglePick = (item) => {
  if (used.condition.pick === item) {
    used.condition.pick = null;
  } else {
    used.condition.pick = item;
  }
}

/**
 * 切换通话次数
 * @param item
 */
const toggleCalls = (item) => {
  if (used.condition.calls === item) {
    used.condition.calls = null;
  } else {
    used.condition.calls = item;
  }
}

/**
 * 切换意向度
 * @param item
 */
const toggleIntent = (item) => {
  if (used.condition.intent === item) {
    used.condition.intent = null;
  } else {
    used.condition.intent = item;
  }
}

/**
 * 切换意向度
 * @param item
 */
const toggleStatus = (item) => {
  if (used.condition.status === item) {
    used.condition.status = null;
  } else {
    used.condition.status = item;
  }
}

/*
* 启动条件筛选页面
* */
watch(() => show.value, () => {
  if (show.value) {
    used.condition = cloneDeep(condition.data);
  }
})


/* 重置条件 */
const reset = () => {
  condition.reset();
  used.condition = cloneDeep(condition.data);
}

/* 设置条件 */
const filter = () => {
  condition.$set(cloneDeep(used.condition))
  show.value = false;
  emit('query');
}

</script>

<style lang="scss" scoped>

.filter {
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  height: 100%;
  overflow: hidden;


  .body {
    height: 100%;
    padding: 10px 18px 25px;
    overflow-y: auto;


    .title {
      width: 100%;
      flex-shrink: 0;
      @include flex-center;
      justify-content: flex-start;
      color: $sm-color;
      font-weight: bold;
      padding: 5px 0 10px;
      font-size: $font-size-4;
    }


    .option {
      list-style: none;
      margin: 0;
      margin-bottom: 15px;

      .label {
        display: inline-flex;
        height: fit-content;
        margin: 5px 8px 5px 0;
        background-color: #f7f7f7;
        border-radius: 5px;
        color: $sub-text-color;
        font-size: $font-size-7;
        padding: 6px 15px;
        white-space: nowrap;
        border: 1px solid transparent;
      }

      .active {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        border: 1px $primary-color solid;
      }
    }

    :deep(.van-field) {
      padding: 0;
      margin: 5px 0 10px;

      .van-field__body {
        border-radius: 12px;
        background-color: #f7f7f7;
        padding: 5px 20px;
        color: $sub-text-color;
        font-size: $font-size-7;
        overflow: hidden;
      }
    }
  }

  .footer {

    display: flex;
    justify-content: center;
    flex-shrink: 0;

    .button {
      padding: 0 30px;
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
      border: 1px $primary-color solid;
      margin: 5px 6px;
      height: 35px;
      width: 40%;


      &:active {
        background-color: $primary-color;
        color: white;
      }

    }

    .reset {
      background-color: white;
    }
  }

}


</style>
<template>

  <van-popup
      v-model:show="filter_visible"
      closeable
      round
      position="right"
      :style="{ width: '80%',height:'100%' }"
  >

    <div class="filter">

      <div class="body">

        <div class="title">标签</div>
        <ul class="label-list">

          <template v-for="item of labels" :key="item.value">

            <li class="label" @click="toggleLabel(item.value)"
                :class="{active:used.condition.label.indexOf(item.value) > -1}">
              {{ item.label }}
            </li>

          </template>


        </ul>


        <div class="title">评级</div>
        <ul class="label-list">

          <template v-for="(item,index) of ['A','B','C','D','M']" :key="item">

            <li class="label" @click="toggleLevel(index+1)"
                :class="{active:used.condition.level === (index+1)}">
              {{ item }}
            </li>

          </template>


        </ul>


        <div class="title">客户星级</div>
        <ul class="label-list">

          <template v-for="(item) of [1,2,3,4]" :key="item">

            <li class="label" @click="toggleStar(item)"
                :class="{active:used.condition.star === item}">
              {{ item }}星
            </li>

          </template>


        </ul>

        <div class="title">联系次数</div>
        <ul class="label-list">
          <template v-for="(item) of [0,5,10]" :key="item">
            <li class="label" @click="used.condition.dial_count = item"
                :class="{active:used.condition.dial_count === item}">
              {{ !item ? "0次" : "小于" + item + "次" }}
            </li>
          </template>
        </ul>


        <div class="title">排序方式</div>
        <ul class="label-list">

          <template v-for="(item,index) of ['按分配时间','按导入时间','按上次拨号']" :key="item">

            <li class="label" @click="used.condition.order=index+1"
                :class="{active:used.condition.order === index+1}">
              {{ item }}
            </li>

          </template>


        </ul>

        <div class="title">排序方向</div>
        <ul class="label-list">

          <template v-for="(item,index) of ['从早到晚','从晚到早']" :key="item">

            <li class="label" @click="used.condition.direct=index+1"
                :class="{active:used.condition.direct === index+1}">
              {{ item }}
            </li>

          </template>


        </ul>

        <div class="title">客户姓名</div>
        <!-- 输入任意文本 -->
        <van-field placeholder="输入客户姓名搜索" v-model="used.condition.name"/>

        <div class="title">公司名称</div>
        <!-- 输入任意文本 -->
        <van-field placeholder="输入公司名称搜索" v-model="used.condition.company"/>

      </div>

      <div class="footer">
        <van-button plain size="small" round type="primary" @click="reset" class="button reset">重置</van-button>
        <van-button plain size="small" round type="primary" @click="filter" class="button">筛选</van-button>
      </div>
    </div>
  </van-popup>

</template>

<script setup>
import {inject, reactive, watch} from "vue";
import {cloneDeep} from "lodash";

const filter_visible = inject('filter_visible');
const labels = inject('labels');
const condition = inject('condition');

const used = reactive({
  condition: cloneDeep(condition.data)
});


/*
* 添加删除标签
* */
const toggleLabel = (item) => {

  const index = used.condition.label.indexOf(item);

  /* 添加 */
  if (index === -1) {
    used.condition.label.push(item);
  } else {
    used.condition.label.splice(index, 1);
  }
}


/*
* 添加删除标签
* */
const toggleLevel = (item) => {
  used.condition.level = item;
}


/**
 * 更新星级
 */
const toggleStar = (star) => {
  used.condition.star = star;
}


/*
* 启动条件筛选页面
* */
watch(() => filter_visible, () => {
  /* 重新拷贝条件对象 */
  if (filter_visible) {
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
  filter_visible.value = false;
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
    padding: 0 15px;
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


    .label-list {
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
        border-radius: 15px;
        background-color: #f7f7f7;
        padding: 3px 20px;
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
      padding: 10px 30px;
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
      border: 1px $primary-color solid;
      margin: 5px 6px;
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
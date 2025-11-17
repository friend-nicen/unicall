<template>
  <template v-if="loaded">
    <div class="statistic">
      <div class="top">
        <div class="left">数据日报</div>

        <div class="right" @click="showCan = true">
          <span class="date">{{ range }}</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="main">
        <div class="item">
          <div class="data">{{ chart.cust }}</div>
          <div class="field">客户总数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.call }}</div>
          <div class="field">通话总数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.day_cust }}</div>
          <div class="field">新增客户</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.day_call }}</div>
          <div class="field">新增通话</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.total }}</div>
          <div class="field">通话次数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.answer }}</div>
          <div class="field">接通次数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.missed }}</div>
          <div class="field">未接次数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.duration }}</div>
          <div class="field">通话时间(s)</div>
        </div>
      </div>
    </div>


    <div class="statistic">
      <div class="top">
        <div class="left">更多应用</div>
        <div class="right"></div>
      </div>
      <div class="main">
        <template v-for="i of app" :key="i.title">
          <div class="app" @click="$router.push(`/browser?url=${i.url}&title=${i.title}`)">
            <div class="logo">
              <img :alt="i.title" :src="i.icon"/>
            </div>
            <div class="field">{{ i.title }}</div>
          </div>
        </template>
      </div>
    </div>
  </template>
  <div v-else class="skeleton">
    <van-skeleton :row="20" title/>
  </div>

  <van-calendar
      v-model:show="showCan"
      :max-date="maxDate"
      :min-date="minDate"
      allow-same-day
      type="single"
      @confirm="selectDate"/>
</template>

<script setup>
import init from './chart';
import initApp from './app';

const {
  showCan,
  selectDate,
  range,
  loaded,
  chart,
  minDate,
  maxDate
} = init()

const app = initApp();

</script>

<style lang="scss" scoped>

.statistic {
  background-color: white;
  border-radius: 21px;
  @include flex-center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 24px 18px 18px 0;
  margin: 20px;


  .top {
    @include flex-center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 24px;


    .left {
      color: $sm-color;
      font-weight: bold;
      padding: 5px 20px 10px;
      font-size: $font-size-3;
    }

    .right {
      @include flex-center;

      .date {
        margin-right: 6px;
      }

      &,
      .text {
        font-size: $font-size-3;
        color: $text-color-sub;
      }
    }
  }

  .main {
    @include flex-center;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;

    .item {
      @include flex-center;
      flex-direction: column;
      width: 33%;
      margin-bottom: 27px;

      .field {
        color: $sm-color;
        margin-top: 8px;
        font-size: $font-size-4;
      }

      .data {
        font-size: 21px;
        color: $font-size-3;
      }

    }


    .app {
      @include flex-center;
      flex-direction: column;
      width: 25%;
      margin-bottom: 27px;


      .field {
        color: $sm-color;
        margin-top: 8px;
        font-size: $font-size-4;
      }

      .logo {
        width: 100%;
        @include flex-center;


        img {
          width: 60%;
          border-radius: 10px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
<template>
  <template v-if="loaded">
    <div class="statistic">
      <div class="top">
        <div class="left">数据概览</div>

        <div class="right" @click="showCan = true">
          {{ range[0] }} ~ {{ range[1] }}
        </div>
      </div>
      <div class="main">
        <div class="item">
          <div class="data">{{ chart.data.count }}</div>
          <div class="field">总用户数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.data.week }}</div>
          <div class="field">一星期内</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.data.half }}</div>
          <div class="field">半个月内</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.data.month }}</div>
          <div class="field">一个月内</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.data.dial_count }}</div>
          <div class="field">通话次数</div>
        </div>
        <div class="item">
          <div class="data">{{ chart.data.dial_duration }}</div>
          <div class="field">通话时长</div>
        </div>
      </div>
    </div>


    <div class="statistic">
      <div class="top">
        <div class="left">更多应用</div>
        <div class="right"></div>
      </div>
      <div class="main">
        <div class="app" @click="openQcc">
          <div class="logo">
            <img src="@/assets/images/qcc.png" alt="企查查"/>
          </div>
          <div class="field">企查查</div>
        </div>
      </div>
    </div>
  </template>
  <div v-else class="skeleton">
    <van-skeleton title :row="20"/>
  </div>

  <van-calendar allow-same-day :min-date="minDate" type="range" v-model:show="showCan" @confirm="selectDate"/>
</template>

<script setup>
import init from './chart'
import extra from './app'


let {
  showCan,
  selectDate,
  range,
  loaded,
  chart,
  minDate
} = init()


let {
  openQcc
} = extra();

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
    justify-content: space-between;

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
          box-shadow: $box-shadow;
        }
      }
    }
  }
}
</style>
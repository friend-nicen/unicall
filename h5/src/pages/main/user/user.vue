<template>
  <div class="main">
    <div class="header-bg">
      <div class="user">
        <!-- 用户同意授权，改为获取到的数据 -->
        <img :src="$api.avatar+$user.nickname"/>
        <div class="right">
          <div class="top">
            <span>{{ $user.nickname }}</span>
          </div>
          <div class="bottom">
            {{ welcome() }}
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="item">
        <div class="flex">
          <van-icon class-prefix="icon" name="wode" size="20"/>
          <span class="left">手机号</span>
        </div>
        <span class="right">{{ $user.username }}</span>
      </div>
      <div class="item">
        <div class="flex">
          <van-icon class-prefix="icon" name="wode" size="20"/>
          <span class="left">所属部门</span>
        </div>
        <span class="right">{{ $user.depart.name }}</span>
      </div>
      <div class="item" @click="quitSystem">
        <div class="flex">
          <van-icon class-prefix="icon" name="tuichu" size="18"/>
          <span class="left">退出登录</span>
        </div>
        <span class="right">Quit</span>
      </div>
    </div>

    <div class="footer">电销助手</div>

  </div>


</template>

<script setup>

import quitSystem from '@/service/quit-system'

/* 提示 */
const welcome = () => {
  let hour = (new Date).getHours();
  return hour + '点了， 祝您工作愉快！';
}

</script>

<style lang="scss" scoped>

.main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
}


.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}


/* 顶部的背景图片 */
.header-bg {
  width: 100%;
  position: relative;
  top: -10px;
  height: 40vh;
  background-image: url("@/assets/images/back_image.svg");
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;

  .user {
    display: flex;
    align-content: center;
    align-items: center;
    margin-top: 10%;
    width: 100%;
    font-size: 18px;

    img {
      border-radius: 50%;
      width: 64px;
      height: 64px;
      margin-right: 15px;
      margin-left: 15px;
    }

    .top {
      display: flex;
      align-items: center;
      width: 100%;

      /* 用户级别 */
      .level {
        padding: 1px 10px;
        background-color: #4CD964;
        border-radius: 15px;
        font-size: 10px;
        color: #ffffff;
        font-weight: bold;
        margin-left: 20px;

      }
    }

    .bottom {
      margin-top: 6px;
      width: 100%;
      font-size: 13px;
      color: #909399;
    }
  }

  .main {
    width: 90%;
    height: 20vh;

    border-radius: 10px;
    box-sizing: border-box;
    background-color: white;
    box-shadow: 1px 1px 15px 1px #E3E3E544, -1px -1px 15px 1px #E3E3E544;

    position: absolute;
    left: 5%;
    right: 5%;
    bottom: 0;

    z-index: 99;

  }


}

/* 底部功能菜单 */
.menu {
  position: relative;
  top: -10vh;
  background-color: white;
  width: 100%;
  margin: 0;
  margin-bottom: 20px;
  padding-bottom: 20px;


  :deep(.icon) {
    font-size: $font-size-2 !important;
  }

  .item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 25px;

    &:active {
      background-color: #f5f5f5;
    }

    .left {
      font-size: $font-size-3;
      margin-left: 15px;
      color: #303133;
    }

    .right {
      color: #606266;
    }

    /* 按钮的样式 */
    .feed {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      line-height: 1.5;
      font-size: 15.5px;
      width: 100%;
      padding: 0;
      margin: 0;
      background-color: #ffffff;

      /* 取消边框 */
      &::after {
        border: none;
      }

      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }


    img {
      border-radius: 50%;
      width: 25px;
    }
  }

}


.popup-code {

  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  border-radius: 8px;
  background-color: white;
  padding: 16px;

  .close {
    position: absolute;
    padding: 10px;
    color: #7e838d;
    cursor: pointer;
    right: 10px;
    top: 10px;
  }

  .code-title {
    padding: 8px 0;
    margin-bottom: 12px;
    font-size: 16px;
    text-align: center;
  }

  .box-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border: 1px solid $primary-color;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 18px;

    input {
      border: none;
    }


    .retry {
      font-size: 14px;
      color: $primary-color;
    }


  }


  .code-button {
    font-size: 14px;
    background-color: $primary-color;
    border-radius: 5px;
    box-sizing: border-box;
    outline: none;
    border: none;
    color: white;
    width: 100%;
    padding: 15px;
    margin: 0 auto 4px;
  }
}


.footer {
  @include flex-center;

  width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  font-size: $font-size-4;
  color: $text-color-sub;
  margin: 8vh 0 5vh;

  &::after,
  &::before {
    display: block;
    width: 20%;
    content: ' ';
    height: 1px;
    background-color: $border-color;
    box-sizing: border-box;
    margin: 0 10px;
  }
}
</style>
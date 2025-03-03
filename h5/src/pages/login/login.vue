<template>
  <div class="container">
    <div class="header">
      <img :src="header" alt="bg"/>
    </div>
    <div class="main">
      <div class="main-item">
        <span class="icon icon-wode left-icon"></span>
        <input v-model="mobile" class="input" placeholder="账号"/>
      </div>
      <div class="main-item">
        <span class="icon icon-mima left-icon"></span>
        <input v-model="password" class="input" placeholder="密码" type="password"/>
      </div>
      <div class="main-item no-item">
        <button class="login" type="default" @click="login">登录</button>
      </div>
    </div>

    <div class="bottom">电销助手</div>
  </div>
</template>

<script setup>
import header from "@/assets/login/header.png"
import init from './login'

const {login, mobile, password} = init();
</script>


<style lang="scss" scoped>
/* 整个容器的样式 */

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}


.container {

  background-color: white;
  width: 100%;
  height: 100%;
  padding: 0;


  /* 顶部的背景图片 */
  .header {
    width: 100%;

    img {
      width: 100%;
    }
  }

  /* 中间的主内容 */
  .main {

    width: 100%;
    margin-top: 10px;

    .main-item {

      width: 100%;
      @extend .flex;
      margin-top: 20px;
      flex-wrap: wrap;
      position: relative;


      .left-icon {
        position: absolute;
        @extend .flex;
        top: 0;
        height: 100%;
        left: 50px;
        color: #84b7ff;
        font-size: 18px;
        z-index: 21;
      }

      /* 输入框 */
      .input {
        width: 80%;
        height: 50px;
        box-sizing: border-box;
        border: #84b7ff 1px solid;
        padding-left: 40px;
        padding-right: 40px;
        border-radius: 30px;
        background-color: rgb(232, 240, 254);
        color: #606266;
        /* 占位符样式 */
        &::placeholder {
          color: #b1b1b1;
        }


      }

      /* 登录按钮 */
      .login {
        border-radius: 30px;
        width: 80%;
        color: white;
        height: 50px;
        margin-top: 20px;
        border: none;
        background-image: linear-gradient(to right, #55bafe, #3072ff);
        box-shadow: 0 1px 15px 1px rgba(95, 79, 79, 0.26);
      }


    }

    .no-item {
      margin-top: 0;
      flex-wrap: wrap;
    }

  }

  .bottom {
    @include flex-center;

    width: 100%;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: $font-size-4;
    color: $text-color-sub;
    margin: 8vh 0;

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
}
</style>
<template>

  <!-- 创建 -->
  <van-popup v-model:show="visible.create" closeable position="bottom" round safe-area-inset-bottom>
    <div class="create-sheet">
      <div class="title">创建任务</div>
      <div class="form">
        <van-form ref="formRef">
          <van-field v-model="form.data.name" :rules="[{ required: true, message: '请输入任务名称' }]" label="任务名称"
                     name="name"
                     placeholder="输入任务名称"/>

          <van-field :rules="[{ required: false, message: '请选择是否自动添加' }]" label="自动添加客户" name="autoAdd">
            <template #input>
              <van-switch v-model="form.data.autoAdd" size="20px"/>
            </template>
          </van-field>

          <van-field :rules="[{ required: false, message: '请选择添加时机' }]" label="接通后才添加"
                     name="addAfterConnect">
            <template #input>
              <van-switch v-model="form.data.addAfterConnect" size="20px"/>
            </template>
          </van-field>

          <van-field
              :rules="[{ required: true, message: '请输入通话间隔' }, { validator: validateSeconds, message: '间隔需为1-60的整数' }]"
              label="每次通话间隔(秒)"
              name="seconds">
            <template #input>
              <van-stepper v-model="form.data.seconds" integer max="60" min="1"/>
            </template>
          </van-field>

          <van-field v-model="form.data.phoneText"
                     :disabled="!!form.data.id"
                     :rules="[{ required: true, message: '请输入至少一个手机号' }, { validator: validatePhones, message: '请至少输入一个有效手机号' }]"
                     class="phones"
                     clearable label="手机号"
                     name="phoneText" placeholder="一行一个手机号" rows="6"
                     type="textarea"/>
        </van-form>
      </div>
      <div class="footer">
        <van-button :disabled="!!form.data.id" class="btn" plain round type="primary" @click="openFilter">筛选导入
        </van-button>
        <van-button class="btn" round type="primary" @click="submit">{{ form.data.id ? "修改" : "创建" }}</van-button>
      </div>
    </div>
  </van-popup>

  <!-- 筛选 -->
  <v-filter @query="filter"/>

</template>

<script setup>

import VFilter from './v-filter.vue';
import initFilter from './filter';
import initCreate from './create';

const {
  form,
  visible,
  submit,
  formRef,
  validatePhones,
  validateSeconds,
  task
} = initCreate();

/* 初始化筛选 */
const {
  openFilter,
  filter
} = initFilter(form);

/* 暴露方法 */
defineExpose({
  open(data = null) {
    if (data) {
      form.$set({
        id: data.id,
        name: data.name,
        phoneText: data.phone,
        seconds: data.interval,
        autoAdd: !!data.auto,
        addAfterConnect: !!data.answer
      })
      task.data = data;
    } else {
      task.data = null;
      form.reset();
    }
    visible.create = true;
  }
})

</script>

<style lang="scss" scoped>
.create-sheet {
  padding: 12px 12px 20px;

  .title {
    font-weight: bold;
    font-size: 16px;
    padding: 8px 12px;
  }

  .form {

    padding: 15px 0;

    :deep(.van-field__label) {
      font-size: $font-size-5;
      white-space: nowrap;
      padding: 5px 0;
    }

    :deep(.van-cell) {
      align-items: center;
    }

    :deep(.van-field__control--custom) {
      justify-content: flex-end;
    }

    .phones {

      align-items: flex-start;

      :deep(textarea) {
        padding: 5px 0;
      }
    }
  }

}

.footer {
  display: flex;
  justify-content: center;
  padding: 10px 0 20px;

  .btn {
    margin: 0 8px;
    width: 40%;
  }

}


</style>

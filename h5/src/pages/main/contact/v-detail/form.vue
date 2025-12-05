<template>
  <van-cell-group inset style="margin: 0;">
    <template v-for="(f,k) in fields" :key="f.key">
      <van-field
          v-if="f.type === 'input'"
          v-model="form[f.key]"
          :label="f.label"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          autosize
      />

      <template v-if="k === 0">
        <van-field :modelValue="form.calls + '次'" :readonly="true" label="通话次数"/>
        <van-field :modelValue="form.pick + '次'" :readonly="true" label="接通次数"/>
        <van-field :modelValue="form.duration + '秒'" :readonly="true" label="通话时长"/>
        <van-field :modelValue="form.follows + '次'" :readonly="true" label="跟进次数"/>
      </template>

      <van-field
          v-else-if="f.type === 'input-number'"
          v-model.number="form[f.key]"
          :label="f.label"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          type="number"
      />
      <van-field
          v-else-if="f.type === 'select'"
          :label="f.label"
          :modelValue="displaySelect(form[f.key], f)"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :readonly="true"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          right-icon="arrow"
          @click="openPicker(f)"
      />
      <van-field
          v-else-if="f.type === 'multi-select'"
          :label="f.label"
          :modelValue="displayMulti(form[f.key], f)"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :readonly="true"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          right-icon="arrow"
          @click="openMulti(f)"
      />
      <van-field
          v-else-if="f.type === 'date-picker'"
          :label="f.label"
          :modelValue="formatDate(form[f.key], f)"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :readonly="true"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          right-icon="arrow"
          @click="openDate(f, 'date')"
      />
      <van-field
          v-else-if="f.type === 'time-picker'"
          :label="f.label"
          :modelValue="formatTime(form[f.key], f)"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :readonly="true"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          right-icon="arrow"
          @click="openDate(f, 'time')"
      />
      <van-field
          v-else-if="f.type === 'datetime-picker'"
          :label="f.label"
          :modelValue="formatDatetime(form[f.key], f)"
          :name="f.key"
          :placeholder="f.attr?.placeholder || ''"
          :readonly="true"
          :required="!!f.attr?.required"
          :rules="rulesFor(f)"
          right-icon="arrow"
          @click="openDate(f, 'datetime')"
      />
    </template>
  </van-cell-group>

  <van-popup v-model:show="state.showPicker" :style="{ height: '50%' }" position="bottom" round>
    <van-picker
        v-if="state.type === 'select' && current?.attr?.options"
        :columns="pickerColumns"
        @cancel="state.showPicker = false"
        @confirm="onPickConfirm"
    />
    <div v-else-if="state.type === 'multi-select'" class="multi-box">
      <van-icon class="close-icon" name="cross" @click="state.showPicker = false"/>
      <div class="title">{{ current?.label }}</div>
      <ul class="options">
        <li
            v-for="opt in (current?.attr?.options || [])"
            :key="opt.value"
            :class="{active: isMultiActive(opt.value)}"
            class="option"
            @click="toggleMulti(opt.value)"
        >{{ opt.label }}
        </li>
      </ul>
      <div class="multi-actions">
        <van-button class="multi-button" round size="small" type="primary" @click="onMultiConfirm">确定</van-button>
      </div>
    </div>
    <van-date-picker
        v-else-if="state.type === 'date'"
        v-model="dateValue"
        @cancel="state.showPicker = false"
        @confirm="onDateConfirm"
    />
    <van-time-picker
        v-else-if="state.type === 'time'"
        v-model="timeValue"
        :columns-type="['hour','minute','second']"
        @cancel="state.showPicker = false"
        @confirm="onTimeConfirm"
    />
    <van-picker-group
        v-else-if="state.type === 'datetime'"
        :tabs="['选择日期','选择时间']"
        :title="current?.label || '选择日期时间'"
        next-step-text="下一步"
        @cancel="() => state.showPicker = false"
        @confirm="onPickerGroupConfirm"
    >
      <van-date-picker v-model="dateValue"/>
      <van-time-picker v-model="timeValue" :columns-type="['hour','minute','second']"/>
    </van-picker-group>
  </van-popup>
</template>

<script setup>
import {computed, reactive, ref, watch} from 'vue'
import dayjs from 'dayjs'
/* 组件：动态表单，支持多类型字段与日期时间格式化 */

const props = defineProps({
  modelValue: {type: Object, default: () => ({})},
  fields: {type: Array, default: () => []}
})
const emit = defineEmits(['update:modelValue'])

/* 响应式表单对象 */
const form = reactive({...props.modelValue})
watch(() => props.modelValue, v => Object.assign(form, v || {}))
watch(form, v => emit('update:modelValue', v), {deep: true})

/* 弹窗状态与当前字段 */
const state = reactive({showPicker: false, type: '', key: ''})
const current = ref(null)

/* 选择项列（来源 attr.options） */
const pickerColumns = computed(() => (current.value?.attr?.options || []).map(i => ({text: i.label, value: i.value})))

/* 选择器当前值（时间为时分秒） */
const dateValue = ref(['', '', ''])
const timeValue = ref(['', '', ''])
const multiSelected = ref([])

/* 工具函数 */
const pad = n => String(n).padStart(2, '0')
const getFormat = (f, def) => f?.attr?.format || def
const getValueFormat = (f, def) => f?.attr?.valueFormat || def

/* 打开单选选择器 */
const openPicker = f => {
  current.value = f;
  state.type = 'select';
  state.key = f.key;
  state.showPicker = true
}


/* 打开多选选择器 */
const openMulti = f => {
  current.value = f;
  state.type = 'multi-select';
  state.key = f.key;
  multiSelected.value = Array.isArray(form[f.key]) ? [...form[f.key]] : (!!form[f.key] ? form[f.key].split(',') : []);
  state.showPicker = true
}

/* 打开日期/时间/日期时间选择器，并初始化为当前值 */
const openDate = (f, t) => {
  current.value = f;
  state.type = t;
  state.key = f.key;
  if (t === 'date') {
    const v = form[f.key]
    const d = dayjs(v)
    if (d.isValid()) {
      dateValue.value = [String(d.year()), pad(d.month() + 1), pad(d.date())]
    } else {
      dateValue.value = ['', '', '']
    }
  } else if (t === 'time') {
    const v = form[f.key]
    /* 支持 HH:mm 或 HH:mm:ss 两种格式解析，统一填充秒 */
    const d = dayjs(v, ['HH:mm', 'HH:mm:ss'], true)
    if (d.isValid()) {
      timeValue.value = [pad(d.hour()), pad(d.minute()), pad(d.second())]
    } else {
      timeValue.value = ['', '', '']
    }
  } else if (t === 'datetime') {
    const v = form[f.key]
    const d = dayjs(v)
    if (d.isValid()) {
      dateValue.value = [String(d.year()), pad(d.month() + 1), pad(d.date())]
      timeValue.value = [pad(d.hour()), pad(d.minute()), pad(d.second())]
    } else {
      const now = dayjs()
      dateValue.value = [String(now.year()), pad(now.month() + 1), pad(now.date())]
      timeValue.value = [pad(now.hour()), pad(now.minute()), '00']
    }
  }
  state.showPicker = true
}

/* 单选确认：兼容 selectedOptions / selectedValues */
const onPickConfirm = ({selectedOptions, selectedValues}) => {
  const val = selectedOptions?.[0]?.value ?? selectedValues?.[0]
  form[state.key] = val;
  state.showPicker = false
}


/* 多选确认 */
const onMultiConfirm = () => {
  form[state.key] = [...multiSelected.value];
  state.showPicker = false
}

/* 多选：判定选中 */
const isMultiActive = (val) => multiSelected.value.includes(val)

/* 多选：切换选中状态 */
const toggleMulti = (val) => {
  const idx = multiSelected.value.indexOf(val)
  if (idx === -1) multiSelected.value.push(val)
  else multiSelected.value.splice(idx, 1)
}

/* 日期确认：按 valueFormat 写入 */
const onDateConfirm = val => {
  const [y, m, d] = val.selectedValues;
  const fmt = getValueFormat(current.value, 'YYYY-MM-DD')
  form[state.key] = dayjs(`${y}-${m}-${d}`, 'YYYY-MM-DD').format(fmt)
  state.showPicker = false
}


/* 时间确认：按 valueFormat 写入（默认 HH:mm，若需要秒则补 00） */
const onTimeConfirm = val => {
  const [h, mi, s] = val.selectedValues;
  const hh = h || '00'
  const mm = mi || '00'
  const ss = s || '00'
  const fmt = getValueFormat(current.value, 'HH:mm:ss')
  /* 组装成 HH:mm:ss 统一格式再格式化输出 */
  form[state.key] = dayjs(`${hh}:${mm}:${ss}`, 'HH:mm:ss').format(fmt)
  state.showPicker = false
}

/* 日期时间确认（PickerGroup）：组合 dateValue 与 timeValue（默认无秒，补 00） */
const onPickerGroupConfirm = () => {
  const [y, m, d] = dateValue.value
  const [h, mi, s] = timeValue.value
  const fmt = getValueFormat(current.value, 'YYYY-MM-DD HH:mm:ss')
  const hh = h || '00'
  const mm = mi || '00'
  const ss = s || '00'
  form[state.key] = dayjs(`${y}-${m}-${d} ${hh}:${mm}:${ss}`, 'YYYY-MM-DD HH:mm:ss').format(fmt)
  state.showPicker = false
}


/* 显示：单选值 -> 标签 */
const displaySelect = (v, f) => {
  const opts = (f.attr?.options) || []
  const hit = opts.find(i => i.value === v)
  return hit ? hit.label : ''
}

/* 显示：多选值数组 -> 标签串 */
const displayMulti = (v, f) => {
  const opts = (f.attr?.options) || []
  const arr = Array.isArray(v) ? v : (!!v ? v.split(',') : []);
  return arr.map(x => opts.find(i => i.value === x)?.label || x).join(',')
}

/* 显示：日期格式化 */
const formatDate = (v, f) => {
  if (!v) return ''
  const fmt = getFormat(f, 'YYYY-MM-DD')
  const d = dayjs(v)
  return d.isValid() ? d.format(fmt) : String(v)
}
/* 显示：时间格式化（兼容 HH:mm 与 HH:mm:ss） */
const formatTime = (v, f) => {
  if (!v) return ''
  const fmt = getFormat(f, 'HH:mm:ss')
  const d = dayjs(v, ['HH:mm:ss', 'HH:mm', 'YYYY-MM-DD HH:mm:ss'], true)
  return d.isValid() ? d.format(fmt) : String(v)
}
/* 显示：日期时间格式化 */
const formatDatetime = (v, f) => {
  if (!v) return ''
  const fmt = getFormat(f, 'YYYY-MM-DD HH:mm:ss')
  const d = dayjs(v)
  return d.isValid() ? d.format(fmt) : String(v)
}

/* 校验：必填 */
const rulesFor = (f) => {
  if (f?.attr?.required) {
    return [{required: true, message: `请完善${f.label}`}]
  }
  return []
}
</script>

<style lang="scss" scoped>
.multi-box {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 右上角关闭图标定位需要相对容器 */
  position: relative;

  .title {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000;
    font-size: 14px;
  }

  /* 关闭图标样式 */
  .close-icon {
    position: absolute;
    right: 15px;
    top: 25px;
    font-size: 18px;
    color: #969799;
    cursor: pointer;
  }

  .options {
    list-style: none;
    margin: 0;
    padding: 10px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    .option {
      display: inline-flex;
      height: fit-content;
      margin: 5px 8px;
      background-color: #f7f7f7;
      border-radius: 5px;
      color: $sub-text-color;
      font-size: $font-size-5;
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

  .multi-actions {
    display: flex;
    justify-content: center;
    padding: 12px 0 6px;
    gap: 15px;

    .multi-button {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
      border: 1px $primary-color solid;
      margin: 20px 20% 15px;
      width: 60%;

      &:active {
        background-color: $primary-color;
        color: white;
      }

    }
  }
}

.datetime-box {
  padding: 12px;
}
</style>

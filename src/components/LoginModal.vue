<script setup>
import { ref } from 'vue'
import { Modal, Input, message } from 'ant-design-vue'
import { verifyPassword, setLoggedIn } from '../lib/auth'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'success'])

const pw = ref('')
const loading = ref(false)

async function handleOk() {
  if (!pw.value) {
    message.warning('请输入密码')
    return
  }
  loading.value = true
  const ok = await verifyPassword(pw.value)
  loading.value = false
  if (ok) {
    setLoggedIn(true, pw.value)
    message.success('登录成功')
    emit('success')
  } else {
    message.error('密码错误')
    pw.value = ''
  }
}

function handleCancel() {
  pw.value = ''
  emit('close')
}
</script>

<template>
  <Modal
    :open="props.open"
    title="管理员登录"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirm-loading="loading"
    ok-text="登录"
    cancel-text="取消"
    :z-index="2000"
  >
    <Input.Password
      v-model:value="pw"
      placeholder="请输入管理员密码"
      @pressEnter="handleOk"
      style="width: 100%"
      autocomplete="current-password"
    />
  </Modal>
</template>

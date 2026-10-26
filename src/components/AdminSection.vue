<script setup>
import { reactive, ref } from 'vue'
import { Input, Button, message, Space, Card, Divider } from 'ant-design-vue'
import { store, saveData, API_BASE } from '../lib/store'

const saving = ref(false)
const lastMode = ref('')

// 编辑用副本（直接绑定 store 字段，保存时落库）
const form = reactive({
  site: store.site,
  experiences: store.experiences,
  projects: store.projects,
  contacts: store.contacts,
})

function addExperience() {
  form.experiences.push({ title: '新经历', period: '2026', role: '职位', desc: '描述内容。' })
}
function removeExperience(i) {
  form.experiences.splice(i, 1)
}
function addProject() {
  form.projects.push({ name: '新项目', year: String(new Date().getFullYear()), desc: '一句话介绍。', link: '#' })
}
function removeProject(i) {
  form.projects.splice(i, 1)
}
function addContact() {
  form.contacts.push({ label: '新联系方式', text: 'value', href: '#' })
}
function removeContact(i) {
  form.contacts.splice(i, 1)
}

async function handleSave() {
  saving.value = true
  const r = await saveData()
  saving.value = false
  if (r.ok) {
    lastMode.value = r.mode === 'cloud' ? '云端数据库' : '本地浏览器'
    message.success(`已保存（${lastMode.value}）`)
  } else {
    message.error(`保存失败：${r.reason || '未知错误'}`)
  }
}
</script>

<template>
  <section role="tabpanel" class="admin">
    <h2>后台管理</h2>
    <p class="admin-note">
      当前数据模式：{{ API_BASE ? '云端数据库（Neon）' : '本地浏览器（localStorage）' }}
      <span v-if="!API_BASE" class="admin-hint">—— 部署 Worker 并配置 VITE_API_BASE 后自动切换云端</span>
    </p>

    <Card size="small" title="个人信息" style="margin-bottom: 16px; background: var(--panel)">
      <Space direction="vertical" style="width: 100%">
        <Input v-model:value="form.site.greeting" placeholder="问候语（如：你好我是 ）" />
        <Input v-model:value="form.site.name" placeholder="名字（BrunoZero）" />
        <Input v-model:value="form.site.tagline" placeholder="一句话介绍" />
        <Input.TextArea v-model:value="form.site.about" placeholder="关于我" :rows="2" />
      </Space>
    </Card>

    <Card size="small" title="经历" style="margin-bottom: 16px; background: var(--panel)">
      <div v-for="(exp, i) in form.experiences" :key="i" class="admin-item">
        <Space direction="vertical" style="width: 100%">
          <Input v-model:value="exp.title" placeholder="公司 / 学校名称" />
          <Space>
            <Input v-model:value="exp.period" placeholder="时间（如 2024 — 至今）" style="width: 200px" />
            <Input v-model:value="exp.role" placeholder="职位 / 专业" style="width: 200px" />
          </Space>
          <Input.TextArea v-model:value="exp.desc" placeholder="描述" :rows="2" />
        </Space>
        <Button type="link" danger size="small" @click="removeExperience(i)" style="margin-top: 6px">删除</Button>
      </div>
      <Button size="small" @click="addExperience">＋ 添加经历</Button>
    </Card>

    <Card size="small" title="作品" style="margin-bottom: 16px; background: var(--panel)">
      <div v-for="(p, i) in form.projects" :key="i" class="admin-item">
        <Space direction="vertical" style="width: 100%">
          <Space>
            <Input v-model:value="p.name" placeholder="项目名称" style="width: 60%" />
            <Input v-model:value="p.year" placeholder="年份" style="width: 90px" />
          </Space>
          <Input v-model:value="p.desc" placeholder="一句话介绍" />
          <Input v-model:value="p.link" placeholder="链接（可留空）" />
        </Space>
        <Button type="link" danger size="small" @click="removeProject(i)" style="margin-top: 6px">删除</Button>
      </div>
      <Button size="small" @click="addProject">＋ 添加作品</Button>
    </Card>

    <Card size="small" title="联系方式" style="margin-bottom: 16px; background: var(--panel)">
      <div v-for="(c, i) in form.contacts" :key="i" class="admin-item">
        <Space>
          <Input v-model:value="c.label" placeholder="标签（邮箱 / GitHub）" style="width: 160px" />
          <Input v-model:value="c.text" placeholder="显示文本" style="width: 220px" />
          <Input v-model:value="c.href" placeholder="链接" style="width: 220px" />
          <Button type="link" danger size="small" @click="removeContact(i)">删除</Button>
        </Space>
      </div>
      <Button size="small" @click="addContact">＋ 添加联系方式</Button>
    </Card>

    <Divider />
    <Button type="primary" :loading="saving" @click="handleSave">保存全部内容</Button>
  </section>
</template>

<style scoped>
.admin-note { color: var(--muted); font-size: 0.9rem; margin-bottom: 16px; }
.admin-hint { color: var(--accent); }
.admin-item {
  border: 1px dashed var(--border); border-radius: 6px;
  padding: 10px 12px; margin-bottom: 10px;
}
.admin :deep(.ant-card-head) { font-size: 0.95rem; }
.admin :deep(.ant-card) { border-color: var(--border); }
</style>

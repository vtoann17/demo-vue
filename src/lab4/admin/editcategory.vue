<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const message = ref('')
const isSuccess = ref(false)

const gundamLine = reactive({
  name: '',
  description: ''
})

onMounted(async () => {
  const id = route.params.id
  const res = await axios.get(`http://localhost:3000/categories/${id}`)
  if (res.status === 200) {
    Object.assign(gundamLine, res.data)
  }
})

const handleUpdate = async () => {
  const id = route.params.id
  if (!gundamLine.name.trim()) {
    message.value = 'Tên dòng Gundam không được để trống!'
    isSuccess.value = false
    return
  }

  const response = await axios.put(`http://localhost:3000/categories/${id}`, { ...gundamLine })
  if (response.status === 200) {
    message.value = 'Cập nhật dòng Gundam thành công!'
    isSuccess.value = true
    setTimeout(() => router.push('/admin/categories'), 1500)
  } else {
    message.value = 'Có lỗi khi cập nhật dòng Gundam!'
    isSuccess.value = false
  }
}

const goTo = (path) => router.push(path)
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 500px; width: 100%;">
      <h3 class="text-center fw-bold text-primary mb-3">✏️ Chỉnh sửa dòng Gundam</h3>
      <p class="text-center text-muted mb-4">Cập nhật thông tin dòng Gundam bên dưới</p>

      <transition name="fade">
        <div
          v-if="message"
          class="alert text-center fw-semibold py-2"
          :class="isSuccess ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </transition>

      <form @submit.prevent="handleUpdate">
        <div class="mb-3">
          <label class="form-label fw-semibold">Tên dòng Gundam <span class="text-danger">*</span></label>
          <input v-model="gundamLine.name" type="text" class="form-control" placeholder="Nhập tên dòng Gundam..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Mô tả</label>
          <textarea
            v-model="gundamLine.description"
            class="form-control"
            rows="3"
            placeholder="Nhập mô tả ngắn về dòng Gundam..."
          ></textarea>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <button type="submit" class="btn btn-primary px-4 fw-semibold">Lưu thay đổi</button>
          <button @click="goTo('/admin/categories')" type="button" class="btn btn-outline-secondary px-4">
            ← Quay lại
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
}
</style>

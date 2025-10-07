<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const message = ref('')
const isSuccess = ref(false)

const category = reactive({
  name: '',
  description: ''
})

const goTo = (path) => router.push(path)

const handleSubmit = async () => {
  if (!category.name.trim()) {
    message.value = 'Tên danh mục không được để trống!'
    isSuccess.value = false
    return
  }
  const response = await axios.post('http://localhost:3000/categories', { ...category })
  if (response.status === 201) {
    message.value = 'Thêm danh mục thành công!'
    isSuccess.value = true
    clearData()
    setTimeout(() => router.push('/admin/categories'), 1500)
  } else {
    message.value = 'Có lỗi khi thêm danh mục!'
    isSuccess.value = false
  }
}

const clearData = () => {
  Object.assign(category, { name: '', description: '' })
}
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 500px; width: 100%;">
      <h3 class="text-center fw-bold text-success mb-3">🗂️ Thêm danh mục mới</h3>
      <p class="text-center text-muted mb-4">Nhập thông tin để tạo danh mục mới</p>

      <transition name="fade">
        <div
          v-if="message"
          class="alert text-center fw-semibold py-2"
          :class="isSuccess ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </transition>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Tên danh mục <span class="text-danger">*</span></label>
          <input
            v-model="category.name"
            type="text"
            class="form-control"
            placeholder="Nhập tên danh mục..."
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Mô tả</label>
          <textarea
            v-model="category.description"
            class="form-control"
            rows="3"
            placeholder="Nhập mô tả ngắn..."
          ></textarea>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <button type="submit" class="btn btn-success px-4 fw-semibold">Lưu danh mục</button>
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
  border-color: #198754;
  box-shadow: 0 0 0 0.15rem rgba(25, 135, 84, 0.25);
}
</style>

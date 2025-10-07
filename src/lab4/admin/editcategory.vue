<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const message = ref('')
const isSuccess = ref(false)

const category = reactive({
  name: '',
  description: ''
})
onMounted(async () => {
  const id = route.params.id
  const res = await axios.get(`http://localhost:3000/categories/${id}`)
  if (res.status === 200) {
    Object.assign(category, res.data)
  }
})

const handleUpdate = async () => {
  const id = route.params.id
  if (!category.name.trim()) {
    message.value = 'Tên danh mục không được để trống!'
    isSuccess.value = false
    return
  }

  const response = await axios.put(`http://localhost:3000/categories/${id}`, { ...category })
  if (response.status === 200) {
    message.value = 'Cập nhật danh mục thành công!'
    isSuccess.value = true
    setTimeout(() => router.push('/admin/categories'), 1500)
  } else {
    message.value = 'Có lỗi khi cập nhật danh mục!'
    isSuccess.value = false
  }
}

const goTo = (path) => router.push(path)
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 500px; width: 100%;">
      <h3 class="text-center fw-bold text-success mb-3">✏️ Sửa danh mục</h3>
      <p class="text-center text-muted mb-4">Cập nhật thông tin danh mục bên dưới</p>

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
          <label class="form-label fw-semibold">Tên danh mục <span class="text-danger">*</span></label>
          <input v-model="category.name" type="text" class="form-control" placeholder="Nhập tên danh mục..." />
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
          <button type="submit" class="btn btn-success px-4 fw-semibold">Lưu thay đổi</button>
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

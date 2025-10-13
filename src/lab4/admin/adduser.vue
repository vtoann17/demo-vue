<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const message = ref('')
const isSuccess = ref(false)

const user = reactive({
  name: '',
  username: '',
  password: '',
  role: 'user'
})

const handleSubmit = async () => {
  if (!user.name.trim() || !user.username.trim() || !user.password.trim()) {
    message.value = 'Vui lòng nhập đầy đủ thông tin!'
    isSuccess.value = false
    return
  }

  const response = await axios.post('http://localhost:3000/users', { ...user })
  if (response.status === 201) {
    message.value = 'Thêm tài khoản thành công!'
    isSuccess.value = true
    clearForm()
    setTimeout(() => router.push('/admin/users'), 1500)
  } else {
    message.value = 'Có lỗi khi thêm tài khoản!'
    isSuccess.value = false
  }
}

const clearForm = () => {
  Object.assign(user, {
    name: '',
    username: '',
    password: '',
    role: 'user'
  })
}
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 550px; width: 100%;">
      <h3 class="text-center fw-bold text-primary mb-3">Thêm tài khoản mới</h3>
      <p class="text-center text-muted mb-4">Nhập thông tin người dùng để thêm vào hệ thống</p>

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
          <label class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
          <input v-model="user.name" type="text" class="form-control" placeholder="Nhập họ và tên..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Tên đăng nhập <span class="text-danger">*</span></label>
          <input v-model="user.username" type="text" class="form-control" placeholder="Nhập tên đăng nhập..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Mật khẩu <span class="text-danger">*</span></label>
          <input v-model="user.password" type="password" class="form-control" placeholder="Nhập mật khẩu..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Vai trò</label>
          <select v-model="user.role" class="form-select">
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <button type="submit" class="btn btn-primary px-4 fw-semibold">Lưu tài khoản</button>
          <button @click="router.push('/admin/users')" type="button" class="btn btn-outline-secondary px-4">
            ← Quay lại
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.form-control:focus, .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
}
</style>

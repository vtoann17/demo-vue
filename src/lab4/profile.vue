<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const message = ref('')
const isSuccess = ref(false)
const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const userId = currentUser ? currentUser.id : null

const user = reactive({
  name: '',
  username: '',
  password: '',
  role: '',
  avatar: ''
})

const preview = ref('')

onMounted(async () => {
  if (!userId) {
    message.value = 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.'
    return
  }

  const response = await axios.get(`http://localhost:3000/users/${userId}`)
  if (response.status === 200) {
    Object.assign(user, res.data)
    preview.value = user.avatar || ''
  }
})

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      preview.value = reader.result
      user.avatar = reader.result
    }
    reader.readAsDataURL(file)
  }
}

const handleUpdate = async () => {
  if (!user.name.trim() || !user.username.trim()) {
    message.value = 'Tên và tài khoản không được để trống!'
    isSuccess.value = false
    return
  }

  const response = await axios.put(`http://localhost:3000/users/${userId}`, { ...user })
  if (response.status === 200) {
    message.value = 'Cập nhật thông tin thành công!'
    isSuccess.value = true
    localStorage.setItem('currentUser', JSON.stringify(user))
  } else {
    message.value = 'Có lỗi xảy ra khi cập nhật!'
    isSuccess.value = false
  }
}

const goTo = (path) => router.push(path)
</script>

<template>
  <div class="d-flex" style="min-height: 100vh; background-color: #f8f9fa;">
   <div class="d-flex" style="min-height: 100vh;">
    <div class="bg-dark text-white p-3" style="width: 250px;">
      <h4 class="mb-4">Hồ sơ</h4>
      <ul class="nav flex-column gap-2">
        <li class="nav-item">
          <button class="btn btn-dark w-100 text-start" @click="goTo('/productlist')">Trang chủ
          </button>
        </li>
      </ul>
    </div>
    <div class="flex-grow-1 p-4">
      <router-view />
    </div>
  </div>
    <div class="flex-grow-1 p-4">
      <div class="card shadow-lg border-0 rounded-4 p-4 mx-auto" style="max-width: 600px;">
        <h3 class="text-center fw-bold text-primary mb-3">Hồ sơ người dùng</h3>
        <p class="text-center text-muted mb-4">Xem và chỉnh sửa thông tin tài khoản của bạn</p>
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
          <div class="text-center mb-3">
            <img
              v-if="preview"
              :src="preview"
              alt="Avatar"
              class="rounded-circle mb-2 shadow"
              style="width: 100px; height: 100px; object-fit: cover;"
            />
            <div>
              <input type="file" @change="handleAvatarChange" accept="image/*" class="form-control mt-2" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Họ và tên</label>
            <input v-model="user.name" type="text" class="form-control" placeholder="Nhập họ và tên..." />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Tên đăng nhập</label>
            <input v-model="user.username" type="text" class="form-control" placeholder="Nhập tên đăng nhập..." />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mật khẩu</label>
            <input v-model="user.password" type="password" class="form-control" placeholder="Nhập mật khẩu..." />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Vai trò</label>
            <input v-model="user.role" type="text" class="form-control" disabled />
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary px-5 fw-semibold">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 240px;
  border-right: 1px solid #ddd;
}

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

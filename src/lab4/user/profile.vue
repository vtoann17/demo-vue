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
  avatar: '',
  age: '',
  gender: '',
  email: ''
})

const preview = ref('')

onMounted(async () => {
  if (!userId) {
    message.value = 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.'
    return
  }
  const res = await axios.get(`http://localhost:3000/users/${userId}`)
  if (res.status === 200) {
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

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}

const goTo = (path) => router.push(path)
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h3 class="logo">Menu người dùng</h3>
      <nav>
        <ul>
          <li @click="goTo('/')"><i class="bi bi-house-door"></i> Trang chủ</li>
          <li class="active"><i class="bi bi-person"></i> Hồ sơ</li>
          <li @click="goTo('/user/wishlist')"><i class="bi bi-heart"></i>Danh sách mong muốn</li>
          <li @click="goTo('/user/order')"><i class="bi bi-heart"></i>Đơn hàng</li>
          <li @click="handleLogout"><i class="bi bi-box-arrow-right"></i> Đăng xuất</li>
        </ul>
      </nav>
    </aside>

    <!-- Main -->
    <main class="content">
      <div class="card shadow border-0 rounded-4 p-4 w-50 mx-auto">
        <h3 class="fw-bold text-primary text-center mb-3">Hồ sơ người dùng</h3>
        <p class="text-center text-muted mb-4">Xem và chỉnh sửa thông tin tài khoản của bạn</p>

        <transition name="fade">
          <div v-if="message" class="alert text-center fw-semibold py-2"
            :class="isSuccess ? 'alert-success' : 'alert-danger'">
            {{ message }}
          </div>
        </transition>

        <form @submit.prevent="handleUpdate">
          <div class="text-center mb-3">
            <img v-if="preview" :src="preview" alt="Avatar" class="rounded-circle mb-2 shadow"
              style="width: 100px; height: 100px; object-fit: cover;" />
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
            <label class="form-label fw-semibold">Email</label>
            <input v-model="user.email" type="email" class="form-control" placeholder="Nhập email của bạn..." />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mật khẩu</label>
            <input v-model="user.password" type="password" class="form-control" placeholder="Nhập mật khẩu..." />
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Tuổi</label>
              <input v-model="user.age" type="number" min="0" class="form-control" placeholder="Nhập tuổi..." />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label fw-semibold">Giới tính</label>
              <select v-model="user.gender" class="form-select">
                <option disabled value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
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
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f1f3f6;
}

/* Sidebar */
.sidebar {
  width: 230px;
  background: linear-gradient(180deg, #0d6efd, #003d9c);
  color: #fff;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}

.sidebar .logo {
  font-size: 22px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 25px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 12px 25px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar li:hover,
.sidebar li.active {
  background: rgba(255, 255, 255, 0.2);
  border-left: 4px solid #fff;
}

.sidebar i {
  font-size: 18px;
}

/* Content */
.content {
  flex: 1;
  margin-left: 230px;
  padding: 25px;
  overflow-y: auto;
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

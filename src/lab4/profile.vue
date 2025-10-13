<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('profile')

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
  router.push('/login')
}
</script>

<template>
  <div class="user-panel">
    <div class="sidebar">
      <h4 class="text-white text-center mb-4">Menu người dùng</h4>
      <ul class="menu">
        <li @click="goTo('/')"><i class="bi bi-house-door"></i> Trang chủ</li>
        <li :class="{ active: activeMenu === 'profile' }" @click="activeMenu = 'profile'">Thông tin cá nhân</li>
        <li :class="{ active: activeMenu === 'wishlist' }" @click="activeMenu = 'wishlist'">Sản phẩm mong muốn</li>
        <li class="logout" @click="handleLogout">Đăng xuất</li>
      </ul>
    </div>
    <div class="content p-4">
      <div v-if="activeMenu === 'profile'" class="card shadow border-0 rounded-4 p-4">
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
      <div v-else-if="activeMenu === 'wishlist'" class="card shadow border-0 rounded-4 p-4">
        <h3 class="text-center fw-bold text-primary mb-3">Sản phẩm mong muốn</h3>
        <p class="text-center text-muted mb-3">Hiển thị danh sách các sản phẩm bạn yêu thích</p>
        <p class="text-center text-secondary">💖 Tính năng này đang được phát triển 💖</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-panel {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  margin: 0;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #007bff, #0056d2);
  color: white;
  padding: 20px 10px 20px 0; /* giảm padding trái để sát mép */
  margin: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed; /* giữ cố định bên trái */
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebar .menu {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.sidebar .menu li {
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar .menu li:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar .menu li.active {
  background: white;
  color: #007bff;
  font-weight: 600;
}

.sidebar .menu li.logout {
  margin-top: 20px;
  background: #dc3545;
  text-align: center;
}

.sidebar .menu li.logout:hover {
  background: #c82333;
}

.content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 30px;
  margin-left: 240px; /* chừa chỗ cho sidebar cố định */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const users = ref([])
const message = ref('')
const router = useRouter()

const goTo = (path) => router.push(path)

onMounted(async () => {
  await loadUsers()
})

const handleDelete = async (id) => {
  const isConfirm = confirm(`Bạn có chắc muốn xoá tài khoản ID = ${id}?`)
  if (isConfirm) {
    const response = await axios.delete(`http://localhost:3000/users/${id}`)
    if (response.status === 200) {
      await loadUsers()
      message.value = `Đã xoá tài khoản ID ${id} thành công!`
      setTimeout(() => (message.value = ''), 3000)
    }
  }
}

const loadUsers = async () => {
  const response = await axios.get('http://localhost:3000/users')
  if (response.status === 200) {
    users.value = response.data
  }
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h3 class="logo">Admin Panel</h3>
      <nav>
        <ul>
          <li @click="goTo('/')"><i class="bi bi-house-door"></i> Trang chủ</li>
          <li @click="goTo('/admin/products')"><i class="bi bi-box"></i> Sản phẩm</li>
          <li @click="goTo('/admin/categories')"><i class="bi bi-tags"></i> Danh mục</li>
          <li @click="goTo('/admin/users')" class="active"><i class="bi bi-people"></i> Người dùng</li>
          <li @click="goTo('/logout')"><i class="bi bi-box-arrow-right"></i> Đăng xuất</li>
        </ul>
      </nav>
    </aside>

    <!-- Main -->
    <main class="content">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-primary mb-0">Quản lý tài khoản</h3>
        <router-link class="btn btn-primary btn-sm px-3" to="/addusers">
          + Thêm tài khoản
        </router-link>
      </div>

      <div class="card shadow border-0 rounded-4 overflow-hidden">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Danh sách người dùng</h4>
        </div>

        <div class="card-body p-0">
          <transition name="fade">
            <div v-if="message" class="alert alert-success text-center py-2 mb-0 rounded-0">
              {{ message }}
            </div>
          </transition>

          <div class="table-responsive p-3">
            <table class="table table-hover table-bordered align-middle text-center mb-0">
              <thead class="table-primary">
                <tr>
                  <th style="width:80px">ID</th>
                  <th>Tên người dùng</th>
                  <th>Tên đăng nhập</th>
                  <th>Vai trò</th>
                  <th style="width:180px">Hành động</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td class="fw-semibold text-start ps-3">{{ user.name }}</td>
                  <td>{{ user.username }}</td>
                  <td>
                    <span
                      :class="user.role === 'admin' ? 'badge bg-danger' : 'badge bg-secondary'"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <button @click="goTo(`/edituser/${user.id}`)" class="btn btn-sm btn-outline-primary me-2">
                      Sửa
                    </button>
                    <button @click="handleDelete(user.id)" class="btn btn-sm btn-outline-danger">
                      Xoá
                    </button>
                  </td>
                </tr>

                <tr v-if="users.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">
                    Chưa có tài khoản nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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

/* === Sidebar === */
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
  letter-spacing: 1px;
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

/* === Content === */
.content {
  flex: 1;
  margin-left: 230px;
  padding: 25px;
  overflow-y: auto;
}

/* === Table === */
.table {
  border-radius: 8px;
  overflow: hidden;
}

.table th {
  background: #e9f1ff;
  font-weight: 600;
  font-size: 15px;
}

.table td {
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f6faff;
  transition: 0.2s;
}

/* === Fade animation === */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

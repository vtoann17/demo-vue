<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goTo = (path) => router.push(path)

const wishlist = ref([])

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('wishlist')) || []
  wishlist.value = data
})

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h3 class="logo">Menu người dùng</h3>
      <nav>
        <ul>
          <li @click="goTo('/')"><i class="bi bi-house-door"></i> Trang chủ</li>
          <li @click="goTo('/user/profile')"><i class="bi bi-person"></i> Hồ sơ</li>
          <li class="active"><i class="bi bi-heart"></i>Danh sách mong muốn</li>
          <li @click="goTo('/user/order')"><i class="bi bi-receipt"></i>Đơn hàng</li>
          <li @click="handleLogout"><i class="bi bi-box-arrow-right"></i> Đăng xuất</li>
        </ul>
      </nav>
    </aside>
    <main class="content">
      <div class="card shadow border-0 rounded-4 p-4">
        <h3 class="fw-bold text-primary text-center mb-3">Danh sách yêu thích</h3>

        <div v-if="wishlist.length === 0" class="text-center text-secondary py-5">
          Chưa có sản phẩm yêu thích nào
        </div>

        <div v-else class="row">
          <div v-for="item in wishlist" :key="item.id" class="col-md-3 mb-4">
            <div class="card h-100 shadow-sm border-0">
              <img :src="item.image" class="card-img-top" style="height: 200px; object-fit: cover" />
              <div class="card-body text-center">
                <h6 class="fw-bold mb-2">{{ item.name }}</h6>
                <p class="text-danger mb-1">{{ Number(item.price).toLocaleString('vi-VN') }}₫</p>
                <button class="btn btn-outline-primary btn-sm" @click="goTo(`/products/${item.id}`)">
                  Xem chi tiết
                </button>
              </div>
            </div>
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
</style>

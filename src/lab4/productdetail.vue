<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const currentUser = ref(null)

const goTo = (path) => router.push(path)

onMounted(async () => {
  const id = route.params.id
  const response = await axios.get(`http://localhost:3000/products/${id}`)
  product.value = response.data

  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
  }
})
</script>

<template>
  <!-- Header -->
  <header class="py-3 bg-white border-bottom shadow-sm sticky-top">
    <div class="container d-flex justify-content-between align-items-center">
      <h3 class="fw-bold text-primary mb-0">Chi tiết sản phẩm</h3>
      <nav class="d-flex align-items-center gap-3">
        <button v-if="!currentUser" class="btn btn-sm btn-outline-primary" @click="goTo('/login')">
          Đăng nhập
        </button>
        <div v-else class="dropdown">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{ currentUser.name }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li v-if="currentUser.role === 'admin'">
              <router-link class="dropdown-item" to="/admin">Trang quản lý</router-link>
            </li>
            <li v-if="currentUser.role === 'user'">
              <router-link class="dropdown-item" to="/profile">Hồ sơ</router-link>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <router-link class="dropdown-item text-danger" to="/logout">Đăng xuất</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>

  <!-- Product Detail -->
  <div v-if="product" class="container my-5">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
      <div class="row g-0 align-items-center">
        <div class="col-md-6">
          <img :src="product.image" alt="Product Image" class="img-fluid w-100 h-100 object-fit-cover"
            style="max-height: 450px;" />
        </div>
        <div class="col-md-6 p-4 p-md-5">
          <h2 class="fw-bold text-dark mb-2">{{ product.title }}</h2>
          <p class="text-muted mb-3">
            Danh mục: <span class="badge bg-secondary">{{ product.category }}</span>
          </p>

          <h3 class="text-danger mb-4">
            {{ Number(product.price).toLocaleString('vi-VN') }} VNĐ
          </h3>

          <p class="text-secondary lh-lg mb-4" style="font-size: 1.05rem;">
            {{ product.description }}
          </p>

          <div class="d-flex flex-wrap gap-3">
            <button class="btn btn-success px-4">
              🛒 Thêm vào giỏ
            </button>
            <button class="btn btn-outline-danger px-4">
              ❤️ Yêu thích
            </button>
            <button @click="goTo('/productlist')" class="btn btn-outline-secondary px-4">
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div v-else class="container my-5 text-center py-5">
    <div class="spinner-border text-primary mb-3" role="status"></div>
    <p class="text-muted">Đang tải dữ liệu sản phẩm...</p>
  </div>
</template>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log(API_URL)

const router = useRouter()
const currentUser = ref(null)
const products = ref([])
const searchQuery = ref('')
const sortOption = ref('default')

const goTo = (path) => router.push(path)

onMounted(async () => {
  await Loadulieu()
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) currentUser.value = JSON.parse(savedUser)
})

const Loadulieu = async () => {
  const response = await axios.get(`${API_URL}/products`)
  if (response.status === 200) products.value = response.data
}

const filteredProducts = computed(() => {
  let result = products.value

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  if (sortOption.value === 'price-asc') {
    result = [...result].sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortOption.value === 'price-desc') {
    result = [...result].sort((a, b) => Number(b.price) - Number(a.price))
  } else if (sortOption.value === 'name-asc') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortOption.value === 'name-desc') {
    result = [...result].sort((a, b) => b.title.localeCompare(a.title))
  }

  return result
})
</script>

<template>
  <header class="py-3 bg-white border-bottom shadow-sm sticky-top">
    <div class="container d-flex justify-content-between align-items-center">
      <h3 class="fw-bold text-primary mb-0">Cửa hàng</h3>
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
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link class="dropdown-item text-danger" to="/logout">Đăng xuất</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h2 class="fw-bold text-dark mb-0">Danh sách sản phẩm</h2>
        <p class="text-muted mb-0">
          Tổng cộng: <strong>{{ filteredProducts.length }}</strong> sản phẩm
        </p>
      </div>

      <div class="d-flex gap-2 flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm"
          placeholder="Tìm kiếm sản phẩm..."
          style="width:200px;"
        />
        <select v-model="sortOption" class="form-select form-select-sm" style="width:180px;">
          <option value="default">Sắp xếp mặc định</option>
          <option value="price-asc">Giá: Thấp đến cao</option>
          <option value="price-desc">Giá: Cao đến thấp</option>
          <option value="name-asc">Tên: A → Z</option>
          <option value="name-desc">Tên: Z → A</option>
        </select>
      </div>
    </div>

    <div class="row g-4">
      <div v-for="p in filteredProducts" :key="p.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm product-card border-0 rounded-4 overflow-hidden">
          <div class="position-relative">
            <img :src="p.image" class="card-img-top" alt="Product" style="height:240px; object-fit:cover;" />
            <span
              class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 small rounded-start"
              v-if="Number(p.price) > 1000000"
            >
              HOT
            </span>
          </div>

          <div class="card-body p-3">
            <h5 class="card-title fw-semibold text-truncate mb-2">{{ p.title }}</h5>
            <p class="text-muted small mb-2 text-truncate">{{ p.description }}</p>
            <h5 class="text-danger mb-3">
              {{ Number(p.price).toLocaleString('vi-VN') }}₫
            </h5>
            <span class="badge bg-secondary">{{ p.category }}</span>
          </div>

          <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
            <router-link :to="`/products/${p.id}`" class="btn btn-sm btn-outline-primary px-3">
              Xem chi tiết
            </router-link>
            <button class="btn btn-sm btn-success px-3">Mua ngay</button>
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="text-center text-muted py-5">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p>Không tìm thấy sản phẩm phù hợp...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 1.05rem;
}
.card-footer {
  transition: background 0.2s ease;
}
.card-footer:hover {
  background-color: #f8f9fa;
}
</style>

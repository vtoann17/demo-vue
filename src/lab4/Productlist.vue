<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const router = useRouter()
const store = useStore()
const currentUser = ref(null)
const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const sortOption = ref('default')
const selectedCategory = ref('all')

const goTo = (path) => router.push(path)

onMounted(async () => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
    await loadCart(currentUser.value.id)
  }
  await Promise.all([loadData(), loadCategories(),])
})


const loadData = async () => {
  const response = await axios.get(`${API_URL}/products`)
  if (response.status === 200) products.value = response.data
}

const loadCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`)
  if (res.status === 200) categories.value = res.data
}

const loadCart = async (userId) => {
  const res = await axios.get(`http://localhost:3000/cart?userId=${userId}`)
  if (res.status === 200) {
    store.dispatch('cart/setCart', res.data)
  }
}

const filteredProducts = computed(() => {
  let result = products.value


  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  if (sortOption.value === 'price-asc') {
    result = [...result].sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortOption.value === 'price-desc') {
    result = [...result].sort((a, b) => Number(b.price) - Number(a.price))
  } else if (sortOption.value === 'name-asc') {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption.value === 'name-desc') {
    result = [...result].sort((a, b) => b.name.localeCompare(a.name))
  }

  return result
})

const selectCategory = (catName) => {
  selectedCategory.value = catName
}

const cartCount = computed(() => store.getters['cart/cartCount'])
</script>



<template>
  <header class="main-header">
    <div class="header-inner d-flex justify-content-between align-items-center">
      <h3 class="fw-bold text-primary mb-0">Cửa hàng</h3>
      <nav class="d-flex align-items-center gap-4">
        <router-link to="/" class="nav-link fw-semibold text-dark">Trang chủ</router-link>
        <router-link to="/productlist" class="nav-link fw-semibold text-dark">Sản phẩm</router-link>
      </nav>
      <nav class="d-flex align-items-center gap-3">
        <button class="cart-btn position-relative btn btn-outline-success btn-sm" @click="goTo('/cart')">
          Giỏ hàng
          <span class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
            {{ cartCount }}
          </span>
        </button>
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
              <router-link class="dropdown-item" to="/admin/products">Trang quản lý</router-link>
            </li>
            <li v-if="currentUser.role === 'user'">
              <router-link class="dropdown-item" to="/user/profile">Hồ sơ</router-link>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li><router-link class="dropdown-item text-danger" to="/logout">Đăng xuất</router-link></li>
          </ul>
        </div>
      </nav>
    </div>
  </header>

  <div class="container-fluid mt-5 px-4 product-page">
    <div class="row g-4">
      <aside class="col-lg-3 mb-4">
        <div class="sidebar bg-white shadow-sm rounded-3 p-3">
          <h5 class="fw-bold mb-3 text-uppercase">Danh mục sản phẩm</h5>
          <ul class="list-unstyled mb-4">
            <li class="py-2 border-bottom">
              <a href="#" class="text-decoration-none fw-semibold"
                :class="selectedCategory === 'all' ? 'text-primary' : 'text-dark'"
                @click.prevent="selectCategory('all')">
                Tất cả sản phẩm
              </a>
            </li>

            <li v-for="cat in categories" :key="cat.id" class="py-2 border-bottom">
              <a href="#" class="text-decoration-none"
                :class="selectedCategory === cat.name ? 'text-primary fw-semibold' : 'text-dark'"
                @click.prevent="selectCategory(cat.name)">
                {{ cat.name }}
              </a>
            </li>

            <li v-if="categories.length === 0" class="text-muted text-center py-3">
              Đang tải danh mục...
            </li>
          </ul>


        </div>
      </aside>
      <section class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 sort-bar">
          <div class="d-flex align-items-center gap-3">

          </div>
          <div class="d-flex align-items-center gap-2">
            <p class="text-muted mb-0 small">
              Tổng <strong>{{ filteredProducts.length }}</strong> sản phẩm
            </p>
            <label class="text-muted small mb-0">Sắp xếp:</label>
            <select v-model="sortOption" class="form-select form-select-sm" style="width:180px;">
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="name-asc">Tên: A → Z</option>
              <option value="name-desc">Tên: Z → A</option>
            </select>
          </div>
        </div>

        <div class="row g-4">
          <div v-for="p in filteredProducts" :key="p.id" class="col-12 col-sm-6 col-md-4">
            <div class="card h-100 border-0 shadow-sm product-card rounded-3 overflow-hidden">
              <div class="position-relative">
                <img :src="p.image" class="card-img-top" alt="Product" style="height:250px; object-fit:cover;">
                <span v-if="Number(p.price) > 1000000" class="badge bg-danger position-absolute top-0 start-0 m-2">
                  HOT
                </span>
              </div>
              <div class="card-body">
                <h6 class="fw-bold text-truncate">{{ p.name }}</h6>
                <p class="text-muted small text-truncate mb-2">{{ p.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semibold text-danger">{{ Number(p.price || 0).toLocaleString('vi-VN') }}₫</span>
                  <router-link :to="`/products/${p.id}`" class="btn btn-outline-primary btn-sm">Xem nhanh</router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center text-muted py-5">
            <div class="spinner-border text-primary mb-3" role="status"></div>
            <p>Không tìm thấy sản phẩm phù hợp...</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>



<style scoped>
.main-header {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: #fff;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  width: 100%;
}


.container-fluid {
  margin-top: 90px;
}

.row {
  align-items: flex-start;
}

.sidebar {
  position: sticky;
  top: 100px;
}

.sidebar ul li a:hover {
  color: #0d6efd;
  transition: 0.2s;
}

.sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px !important;
  padding-bottom: 10px !important;
}

.mt-5 {
  margin-top: 100px !important;
}

.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  background-color: #0d6efd;
  /* Bootstrap success */
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.cart-btn .badge {
  font-size: 0.7rem;
  padding: 4px 6px;
}
</style>

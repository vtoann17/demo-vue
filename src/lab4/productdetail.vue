<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const router = useRouter()
const product = ref(null)
const currentUser = ref(null)
const relatedProducts = ref([])

const goTo = (path) => router.push(path)

const fetchProduct = async (id) => {
  const response = await axios.get(`http://localhost:3000/products/${id}`)
  product.value = response.data
  const relatedResponse = await axios.get(`http://localhost:3000/products?category=${product.value.category}`)
  relatedProducts.value = relatedResponse.data.filter(p => p.id !== product.value.id)
}

onMounted(async () => {
  const id = route.params.id
  await fetchProduct(id)

 if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
    await loadCart(currentUser.value.id)
  }
})

watch(() => route.params.id, async (newId) => {
  await fetchProduct(newId)
})
const loadCart = async (userId) => {
  const res = await axios.get(`http://localhost:3000/cart?userId=${userId}`)
  if (res.status === 200) {
    store.dispatch('cart/setCart', res.data)
  }
}
const successMessage = ref('')
const showMessage = (msg) => {
  successMessage.value = msg
  setTimeout(() => {
    successMessage.value = ''
  }, 2000)
}

const addToCart = (product) => {
  if (!currentUser.value) {
    localStorage.setItem('redirectAfterLogin', router.currentRoute.value.fullPath)
    goTo('/login')
    return
  }
  store.dispatch('cart/addToCart', product)
  showMessage('Đã thêm sản phẩm vào giỏ hàng!')
}

const cartCount = computed(() => store.getters['cart/cartCount'])
const addToWishlist = async (product) => {
  if (!currentUser.value) {
    localStorage.setItem('redirectAfterLogin', router.currentRoute.value.fullPath)
    goTo('/login')
    return
  }
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || []

  const exists = wishlist.some(item => item.id === product.id)
  if (exists) {
    showMessage('Sản phẩm đã có trong danh sách yêu thích!')
    return
  }

  wishlist.push(product)
  localStorage.setItem('wishlist', JSON.stringify(wishlist))

  const response = await axios.post('http://localhost:3000/wishlist', {
    userId: currentUser.value.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category
  })

  if (response.status === 201) {
    showMessage('Đã thêm vào danh sách yêu thích!')
  }
}

</script>

<template>
  <header class="main-header">
    <div class="header-inner d-flex justify-content-between align-items-center">
      <h3 class="fw-bold text-primary mb-0">Gundam Store</h3>
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
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
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
  <div v-if="product" class="container product-detail my-5 py-4">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden p-3">
      <div class="row g-4 align-items-center">
        <div class="col-md-6 text-center">
          <img :src="product.image" alt="Product Image" class="img-fluid rounded-4 shadow-sm product-img" />
        </div>

        <div class="col-md-6">
          <h2 class="fw-bold text-dark mb-3">{{ product.name }}</h2>

          <p class="text-muted mb-2">
            Dòng: <span class="badge bg-primary-subtle text-primary fw-semibold">{{ product.category }}</span>
          </p>

          <h3 class="text-danger fw-bold mb-4">
            {{ Number(product.price).toLocaleString('vi-VN') }} VNĐ
          </h3>

          <p class="text-secondary lh-lg mb-4" style="font-size: 1.05rem;">
            {{ product.description }}
          </p>

          <div class="d-flex flex-wrap gap-3">
            <button class="btn btn-success px-4 py-2 fw-semibold shadow-sm" @click="addToCart(product)">
              🛒 Thêm vào giỏ hàng
            </button>
            <button class="btn btn-outline-danger px-4 py-2 fw-semibold" @click="addToWishlist(product)">
              ❤️ Yêu thích
            </button>
            <button @click="goTo('/productlist')" class="btn btn-outline-secondary px-4 py-2 fw-semibold">
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="relatedProducts.length" class="container my-5">
    <h3 class="fw-bold mb-4 text-center text-primary">Sản phẩm liên quan</h3>

    <div class="row g-4">
      <div v-for="item in relatedProducts" :key="item.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
          <img :src="item.image" alt="related" class="card-img-top" style="object-fit: cover; height: 220px;" />
          <div class="card-body">
            <h6 class="fw-bold text-dark">{{ item.name }}</h6>
            <p class="text-danger fw-semibold mb-2">
              {{ Number(item.price).toLocaleString('vi-VN') }} VNĐ
            </p>
            <router-link :to="`/products/${item.id}`"
              class="btn btn-sm btn-outline-primary w-100 fw-semibold text-center">
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container text-center py-5">
    <div class="spinner-border text-primary mb-3" role="status"></div>
    <p class="text-muted">Đang tải thông tin sản phẩm...</p>
  </div>

  <transition name="fade">
    <div v-if="successMessage" class="alert-message bg-success text-white px-4 py-2 rounded shadow">
      {{ successMessage }}
    </div>
  </transition>
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
  padding: 12px 40px;
}

.nav-link {
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #0d6efd;
}

.product-detail {
  margin-top: 100px !important;
}

.product-img {
  max-height: 450px;
  object-fit: cover;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.product-img:hover {
  transform: scale(1.05);
}

.btn {
  border-radius: 8px;
  transition: all 0.25s ease;
}

.btn:hover {
  transform: translateY(-2px);
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
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.cart-btn .badge {
  font-size: 0.7rem;
  padding: 4px 6px;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.alert-message {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  font-weight: 500;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }

  10%,
  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

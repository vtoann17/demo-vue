<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

const store = useStore()
const router = useRouter()
const goTo = (path) => router.push(path)

const currentUser = ref(null)
const products = ref([])
const categories = ref([])

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

onMounted(async () => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) currentUser.value = JSON.parse(savedUser)
    await Promise.all([loadProducts(), loadCategories()])
})

const loadProducts = async () => {
    const res = await axios.get(`${API_URL}/products`)
    if (res.status === 200) products.value = res.data
}

const loadCategories = async () => {
    const res = await axios.get(`${API_URL}/categories`)
    if (res.status === 200) categories.value = res.data
}

const successMessage = ref('')

const showMessage = (msg) => {
    successMessage.value = msg
    setTimeout(() => {
        successMessage.value = ''
    }, 2000)
}

const addToCart = (product) => {
    store.dispatch('cart/addToCart', product)
    showMessage('Đã thêm sản phẩm vào giỏ hàng!')
}

const cartCount = computed(() => store.getters['cart/cartCount'])
</script>


<template>
    <div class="home-page">
        <header class="main-header shadow-sm">
            <div class="header-inner container d-flex justify-content-between align-items-center py-3">
                <h3 class="fw-bold text-primary mb-0">Cửa hàng</h3>

                <nav class="d-flex align-items-center gap-4">
                    <router-link to="/" class="nav-link fw-semibold">Trang chủ</router-link>
                    <router-link to="/productlist" class="nav-link fw-semibold">Sản phẩm</router-link>
                </nav>

                <div class="d-flex align-items-center gap-3">
                    <button class="cart-btn position-relative btn btn-outline-success btn-sm" @click="goTo('/cart')">
                        Giỏ hàng
                        <span class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                            {{ cartCount }}
                        </span>
                    </button>
                    <button v-if="!currentUser" class="btn btn-sm btn-outline-primary px-3" @click="goTo('/login')">
                        Đăng nhập
                    </button>
                    <div v-else class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            {{ currentUser.name }}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                            <li v-if="currentUser.role === 'admin'">
                                <router-link class="dropdown-item" to="/admin/products">Trang quản lý</router-link>
                            </li>
                            <li v-if="currentUser.role === 'user'">
                                <router-link class="dropdown-item" to="/profile">Hồ sơ</router-link>
                            </li>
                            <li>
                                <hr class="dropdown-divider" />
                            </li>
                            <li>
                                <router-link class="dropdown-item text-danger" to="/logout">
                                    Đăng xuất
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>

        <section class="banner position-relative">
            <img src="/img/mobile-suit-gundam-online-taiwan-announcement-banner.jpg.webp" class="w-100 banner-img"
                alt="banner" />
            <div class="banner-text text-white text-center">
                <h1 class="fw-bold display-5">Bộ sưu tập mới</h1>
                <p class="lead mb-3">Khám phá các mô hình Gundam nổi bật</p>
                <router-link class="btn btn-primary btn-lg" to="/productlist">Mua ngay</router-link>
            </div>
        </section>
        <section class="categories container py-5">
            <h2 class="section-title text-center fw-bold mb-4">Danh mục nổi bật</h2>
            <div class="row g-4">
                <div v-for="cat in categories" :key="cat.id" class="col-6 col-md-3 text-center">
                    <div class="category-card rounded-4 shadow-sm p-3 bg-white">
                        <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="img-fluid rounded mb-2"
                            style="height: 180px; object-fit: cover;" />
                        <h5 class="fw-semibold">{{ cat.name }}</h5>
                        <p class="text-muted small">{{ cat.description }}</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="featured container py-5">
            <h2 class="section-title text-center fw-bold mb-4">Sản phẩm nổi bật</h2>
            <div class="row g-4">
                <div v-for="p in products" :key="p.id" class="col-6 col-md-3">
                    <div class="product-card p-3 text-center bg-white shadow-sm rounded-4">
                        <img :src="p.image" alt="p.name" class="img-fluid rounded mb-2"
                            style="height: 200px; object-fit: cover;" />
                        <h6 class="fw-semibold">{{ p.name }}</h6>
                        <p class="text-muted mb-2">{{ p.price.toLocaleString() }}₫</p>
                        <button class="btn btn-outline-primary" @click="addToCart(p)">
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <transition name="fade">
            <div v-if="successMessage" class="alert-message bg-success text-white px-4 py-2 rounded shadow">
                {{ successMessage }}
            </div>
        </transition>
    </div>
</template>


<style scoped>
.main-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 1000;
    border-bottom: 1px solid #eee;
}

.home-page {
    margin-top: 80px;
    background-color: #fafafa;
}

.nav-link {
    color: #333;
    transition: color 0.2s;
}

.nav-link:hover {
    color: #0d6efd;
}


.banner {
    position: relative;
    margin-top: 20px;
}

.banner-img {
    height: 450px;
    object-fit: cover;
    filter: brightness(0.7);
}

.banner-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.category-card {
    transition: all 0.3s ease;
}

.category-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.cart-btn .badge {
    font-size: 0.7rem;
    padding: 4px 6px;
}

.alert-message {
    position: fixed;
    top: 80px;
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
    10%, 90% {
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

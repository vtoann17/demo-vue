<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()
const currentUser = ref(null)
const method = route.query.method || 'cod'

onMounted(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) currentUser.value = JSON.parse(savedUser)
})
const cartCount = computed(() => store.getters['cart/cartCount'])

const goTo = (path) => router.push(path)
</script>

<template>
    <div class="payment-success-page">
        <header class="main-header shadow-sm bg-white">
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
                                <router-link class="dropdown-item" to="/user/profile">Hồ sơ</router-link>
                            </li>
                            <li>
                                <hr class="dropdown-divider" />
                            </li>
                            <li>
                                <router-link class="dropdown-item text-danger" to="/logout">Đăng xuất</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        <section class="container text-center py-5 mt-5">
            <div class="success-box bg-white rounded-4 shadow-sm p-5 mx-auto" style="max-width: 600px;">
                <div class="text-success mb-3" style="font-size: 60px;">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <div v-if="method === 'cod'" class="mt-4">
                    <h2 class="fw-bold text-success mb-3">Đặt hàng thành công!</h2>
                    <p class="text-muted mb-4">
                        Cảm ơn bạn đã mua hàng tại <strong>Toàn Thời Trang</strong>.<br />
                        Đơn hàng của bạn đang được xử lý và sẽ giao sớm nhất có thể.
                    </p>
                    <div class="d-flex justify-content-center gap-3"> <router-link to="/"
                            class="btn btn-primary px-4">Về trang chủ</router-link> <router-link to="/user/order"
                            class="btn btn-outline-success px-4">Xem đơn hàng</router-link> </div>
                </div>

                <div v-else-if="method === 'bank'" class="mt-4">
                    <h2 class="fw-bold text-success mb-3">Thanh toán thành công!</h2>
                    <p class="text-muted mb-4">
                        Thanh toán của bạn đã được xác nhận.<br />
                        Cảm ơn bạn đã tin tưởng <strong>Toàn Thời Trang</strong>.
                    </p>
                    <div class="d-flex justify-content-center gap-3"> <router-link to="/"
                            class="btn btn-primary px-4">Về trang chủ</router-link> <router-link to="/user/order"
                            class="btn btn-outline-success px-4">Xem đơn hàng</router-link> </div>
                </div>

            </div>
        </section>
    </div>
</template>

<style scoped>
.payment-success-page {
    background-color: #f8f9fa;
    min-height: 100vh;
}

/* Header giống trang Home */
.main-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 1000;
    border-bottom: 1px solid #eee;
}

.nav-link {
    color: #333;
    transition: color 0.2s;
}

.nav-link:hover {
    color: #0d6efd;
}

/* Box thành công */
.success-box {
    animation: fadeIn 0.6s ease;
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

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

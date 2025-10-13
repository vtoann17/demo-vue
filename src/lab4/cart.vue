<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const goTo = (path) => router.push(path)

const cartItems = computed(() => store.getters['cart/cartItems'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const cartCount = computed(() => store.getters['cart/cartCount'])

const currentUser = ref(null)
onMounted(() => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) currentUser.value = JSON.parse(savedUser)
})

const remove = (id) => store.dispatch('cart/removeFromCart', id)
const clearCart = () => store.dispatch('cart/clearCart')
</script>

<template>
  <div class="cart-page">
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

          <button
            v-if="!currentUser"
            class="btn btn-sm btn-outline-primary px-3"
            @click="goTo('/login')"
          >
            Đăng nhập
          </button>

          <div v-else class="dropdown">
            <button
              class="btn btn-sm btn-outline-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {{ currentUser.name }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li v-if="currentUser.role === 'admin'">
                <router-link class="dropdown-item" to="/admin/products">Trang quản lý</router-link>
              </li>
              <li v-if="currentUser.role === 'user'">
                <router-link class="dropdown-item" to="/profile">Hồ sơ</router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
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
    <section class="cart-section container py-5">
      <h2 class="fw-bold text-center mb-4">Giỏ hàng</h2>

      <div v-if="!cartItems || cartItems.length === 0" class="text-center text-muted py-5">
        <p>Chưa có sản phẩm nào trong giỏ.</p>
        <button class="btn btn-primary mt-3" @click="goTo('/productlist')">
          Mua sắm ngay
        </button>
      </div>

      <div v-else class="row justify-content-center">
        <div class="col-lg-8">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item d-flex align-items-center justify-content-between bg-white rounded-4 shadow-sm p-3 mb-3"
          >
            <div class="d-flex align-items-center gap-3">
              <img :src="item.image" alt="item.name" class="cart-img rounded" />
              <div>
                <h6 class="fw-semibold mb-1">{{ item.name }}</h6>
                <p class="text-muted mb-0">{{ item.price.toLocaleString() }}₫</p>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input
                type="number"
                v-model.number="item.quantity"
                min="1"
                class="form-control form-control-sm text-center"
                style="width: 70px;"
              />
              <p class="fw-semibold mb-0">{{ (item.price * item.quantity).toLocaleString() }}₫</p>
              <button class="btn btn-sm btn-outline-danger" @click="remove(item.id)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <div class="text-end mt-4">
            <h5 class="fw-bold">
              Tổng cộng:
              <span class="text-primary">{{ cartTotal.toLocaleString() }}₫</span>
            </h5>
            <div class="mt-3 d-flex justify-content-end gap-2">
              <button class="btn btn-outline-danger" @click="clearCart">Xóa tất cả</button>
              <button class="btn btn-success">Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cart-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-top: 80px;
}

/* Header */
.main-header {
   position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 1000;
    border-bottom: 1px solid #eee;
}
.nav-link:hover {
  color: #0d6efd;
}

/* Giỏ hàng */
.cart-section {
  padding-bottom: 80px;
}

.cart-item {
  transition: all 0.3s ease;
}
.cart-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.cart-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
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
</style>

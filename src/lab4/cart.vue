<script setup>
import axios from 'axios'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const goTo = (path) => router.push(path)
const API_KEY = "2068e364-a962-11f0-8a8c-d60461a34742"
const idShop = 6063478
const provinces = ref()
const province_id = ref("")
const districts = ref()
const district_id = ref("")
const wards = ref()
const wards_id = ref("")
const tinhPhi = ref()
const name = ref('')
const phone = ref('')
const address = ref('')
const note = ref('')
const paymentMethod = ref('')
const tinhPhiShip = async () => {
  const res = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_KEY,
      'ShopID': idShop
    },
    params: {
      'service_type_id': 2,
      'to_district_id': parseInt(district_id.value),
      'to_ward_code': wards_id.value,
      "length": 30,
      "width": 40,
      "height": 20,
      "weight": 3000,
      "insurance_value": 0,
      "coupon": null,
    }
  })
  tinhPhi.value = res.data.data

}

const loadProvince = async () => {
  const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_KEY
    }
  })
  provinces.value = response.data.data
}
const loadDistrict = async () => {
  const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${province_id.value}`, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_KEY
    },
  })
  districts.value = response.data.data
}
const loadWard = async () => {
  const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district_id.value}`, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_KEY
    },
  })
  wards.value = response.data.data
}



const cartItems = computed(() => store.getters['cart/cartItems'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const cartCount = computed(() => store.getters['cart/cartCount'])

const currentUser = ref(null)
onMounted(() => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) currentUser.value = JSON.parse(savedUser)
  loadProvince()

})

const remove = (id) => store.dispatch('cart/removeFromCart', id)
const tongThanhToan = computed(() => {
  if (!tinhPhi.value) return cartTotal.value
  return cartTotal.value + tinhPhi.value.total
})
const handleThanhtoan = async () => {
  if (!name.value || !phone.value || !address.value || !paymentMethod.value) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  const order = {
    id: Date.now(),
    userId: currentUser.value ? currentUser.value.id : null,
    name: name.value,
    phone: phone.value,
    address: address.value,
    note: note.value,
    province_id: province_id.value,
    district_id: district_id.value,
    wards_id: wards_id.value,
    cart: cartItems.value,
    total: cartTotal.value,
    ship_fee: tinhPhi.value ? tinhPhi.value.total : 0,
    grand_total: tongThanhToan.value,
    paymentMethod: paymentMethod.value,
    status: "Đang xử lý",
    createdAt: new Date().toISOString()
  };

  try {
    await axios.post('http://localhost:3000/orders', order);
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    store.dispatch('cart/clearCart');

    alert('Thanh toán thành công! Đơn hàng đã được lưu.');
    router.push('/');
  } catch (error) {
    console.error(error);
    alert('Có lỗi xảy ra khi thanh toán!');
  }
};



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
          <div v-for="item in cartItems" :key="item.id"
            class="cart-item d-flex align-items-center justify-content-between bg-white rounded-4 shadow-sm p-3 mb-3">
            <div class="d-flex align-items-center gap-3">
              <img :src="item.image" alt="item.name" class="cart-img rounded" />
              <div>
                <h6 class="fw-semibold mb-1">{{ item.name }}</h6>
                <p class="text-muted mb-0">{{ item.price.toLocaleString() }}₫</p>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="number" v-model.number="item.quantity" min="1"
                class="form-control form-control-sm text-center" style="width: 70px;" />
              <p class="fw-semibold mb-0">{{ (item.price * item.quantity).toLocaleString() }}₫</p>
              <button class="btn btn-sm btn-outline-danger" @click="remove(item.id)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="checkout-form bg-white p-4 rounded-4 shadow-sm mt-4">
      <h5 class="fw-bold mb-3">Thông tin thanh toán</h5>

      <form>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold">Họ và tên</label>
            <input v-model="name" type="text" required class="form-control" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold">Số điện thoại</label>
            <input v-model="phone" type="text" required class="form-control" />
          </div>
          <div class="col-md-12 mb-3">
            <label class="form-label fw-semibold">Địa chỉ</label>
            <div class="row g-3">
              <div class="col-md-4">
                <select @change="loadDistrict()" v-model="province_id" class="form-select" required>
                  <option selected value="">-- Tỉnh / Thành phố --</option>
                  <option v-for="province in provinces" :value="province.ProvinceID" :key="province.ProvinceID">{{
                    province.ProvinceName }}</option>

                </select>
              </div>

              <div class="col-md-4">
                <select :disabled="province_id == ''" v-model="district_id" @change="loadWard()" class="form-select"
                  required>
                  <option selected value="">-- Quận / Huyện --</option>
                  <option v-for="district in districts" :value="district.DistrictID" :key="district.DistrictID">
                    {{ district.DistrictName }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <select @change="tinhPhiShip()" :disabled="district_id == ''" v-model="wards_id" class="form-select"
                  required>
                  <option selected value="">-- Phường / Xã --</option>
                  <option v-for="ward in wards" :value="ward.WardCode" :key="ward.WardCode">{{ ward.WardName }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Số nhà, tên đường</label>
              <input v-model="address" type="text" class="form-control" placeholder="VD: 08/40 Phạm Hùng" required />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Ghi chú (tuỳ chọn)</label>
              <textarea v-model="note" rows="1" class="form-control" placeholder="Ghi chú thêm (nếu có)"></textarea>
            </div>
          </div>


          <div class="col-md-12 mb-3">
            <label class="form-label fw-semibold d-block mb-2">Phương thức thanh toán</label>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="paymentMethod" value="cod" v-model="paymentMethod"
                required />
              <label class="form-check-label">Thanh toán khi nhận hàng (COD)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="paymentMethod" value="bank" v-model="paymentMethod" />
              <label class="form-check-label">Chuyển khoản ngân hàng</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="paymentMethod" value="momo" v-model="paymentMethod" />
              <label class="form-check-label">Ví MoMo</label>
            </div>
          </div>

          <div v-if="tinhPhi" class="col-md-12 mb-3">
            <div class="shipping-fee-box bg-light p-3 rounded-3 border">
              <h6 class="fw-bold mb-2">Chi tiết phí </h6>
              <div class="d-flex justify-content-between">
                <span>Phí sản phẩm:</span>
                <span class="fw-semibold text-primary">{{ cartTotal.toLocaleString() }}₫</span>
              </div>
              <div class="d-flex justify-content-between mt-1">
                <span>Phí vận chuyển:</span>
                <span class="fw-bold text-success">{{ tinhPhi.total.toLocaleString() }}₫</span>
              </div>
              <hr />
              <div class="d-flex justify-content-between mt-2">
                <span class="fw-bold">Tổng thanh toán (hàng + ship):</span>
                <span class="fw-bold text-danger fs-6">
                  {{ tongThanhToan.toLocaleString() }}₫
                </span>
              </div>
            </div>
          </div>



        </div>
        <div class="text-end mt-4">
          <button class="btn btn-success px-4" type="submit" @click="handleThanhtoan()">Thanh toán</button>
        </div>
      </form>
    </div>

  </div>
  <!-- Form thanh toán -->


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

.shipping-fee-box {
  background-color: #f9fafb;
  border: 1px solid #e3e6ea;
  border-radius: 12px;
  transition: 0.3s ease;
}

.shipping-fee-box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.shipping-fee-box span {
  font-size: 0.95rem;
}
</style>

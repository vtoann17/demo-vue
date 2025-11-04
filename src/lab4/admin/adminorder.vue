<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const orders = ref([])
const message = ref('')
const filterStatus = ref('Tất cả')
const router = useRouter()

const goTo = (path) => router.push(path)

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  try {
    const res = await axios.get('http://localhost:3000/orders')
    if (res.status === 200) orders.value = res.data.reverse()
  } catch (e) {
    console.error('Lỗi tải đơn hàng:', e)
  }
}

const updateStatus = async (order) => {
  try {
    await axios.patch(`http://localhost:3000/orders/${order.id}`, {
      status: order.status
    })
    message.value = `Đã cập nhật trạng thái đơn hàng #${order.id} thành "${order.status}"`
    setTimeout(() => (message.value = ''), 3000)
  } catch (e) {
    console.error('Lỗi cập nhật trạng thái:', e)
  }
}

const handleDelete = async (id) => {
  const isConfirm = confirm(`Bạn có chắc muốn xoá đơn hàng ID = ${id}?`)
  if (isConfirm) {
    const res = await axios.delete(`http://localhost:3000/orders/${id}`)
    if (res.status === 200) {
      await loadOrders()
      message.value = `Đã xoá đơn hàng ID ${id} thành công!`
      setTimeout(() => (message.value = ''), 3000)
    }
  }
}

const filteredOrders = computed(() => {
  if (filterStatus.value === 'Tất cả') return orders.value
  return orders.value.filter((o) => o.status === filterStatus.value)
})
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h3 class="logo">Admin Panel</h3>
      <nav>
        <ul>
          <li @click="goTo('/')"><i class="bi bi-house-door"></i> Trang chủ</li>
          <li @click="goTo('/admin/statistic')">
                        <i class="bi bi-speedometer2"></i> Tổng quan
                    </li>
          <li @click="goTo('/admin/products')"><i class="bi bi-box"></i> Sản phẩm</li>
          <li @click="goTo('/admin/categories')"><i class="bi bi-tags"></i> Danh mục</li>
          <li @click="goTo('/admin/users')"><i class="bi bi-people"></i> Người dùng</li>
          <li @click="goTo('/admin/orders')" class="active"><i class="bi bi-receipt"></i> Đơn hàng</li>
          <li @click="goTo('/logout')"><i class="bi bi-box-arrow-right"></i> Đăng xuất</li>
        </ul>
      </nav>
    </aside>
    <main class="content">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-primary mb-0">Quản lý đơn hàng</h3>
      </div>

      <div class="card shadow border-0 rounded-4 overflow-hidden">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Danh sách đơn hàng</h4>
          <select v-model="filterStatus" class="form-select w-auto bg-white text-dark border-0 rounded-pill">
            <option>Tất cả</option>
            <option>Chờ xác nhận</option>
            <option>Đã xác nhận</option>
            <option>Đang giao hàng</option>
            <option>Hoàn tất</option>
            <option>Đã hủy</option>
          </select>
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
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Địa chỉ</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th style="width:180px">Hành động</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in filteredOrders" :key="item.id">
                  <td class="fw-semibold text-primary">#{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.phone }}</td>
                  <td class="text-start">{{ item.address }}</td>
                  <td class="text-danger fw-bold">
                    {{ Number(item.grand_total || item.total).toLocaleString('vi-VN') }}₫
                  </td>
                  <td>
                    <select v-model="item.status" @change="updateStatus(item)"
                      class="form-select form-select-sm text-center fw-semibold"   :disabled="item.status === 'Đã hủy'" :class="{
                        'text-secondary': item.status === 'Chờ xác nhận',
                        'text-primary': item.status === 'Đã xác nhận',
                        'text-info': item.status === 'Đang giao hàng',
                        'text-success': item.status === 'Hoàn tất',
                        'text-danger': item.status === 'Đã hủy'
                      }">
                      <option>Chờ xác nhận</option>
                      <option>Đã xác nhận</option>
                      <option>Đang giao hàng</option>
                      <option>Hoàn tất</option>
                      <option>Đã hủy</option>
                    </select>
                  </td>
                  <td>{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="goTo(`/admin/orders/${item.id}`)">
                      Xem
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item.id)">
                      Xóa
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredOrders.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">
                    Không có đơn hàng nào phù hợp
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
  margin: 0;
  padding: 0;
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

/* Content */
.content {
  flex: 1;
  margin-left: 230px;
  padding: 25px;
  overflow-y: auto;
}

/* Table */
.table th {
  background: #e9f1ff;
  font-weight: 600;
  font-size: 15px;
}

.table tbody tr:hover {
  background-color: #f6faff;
  transition: 0.2s;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

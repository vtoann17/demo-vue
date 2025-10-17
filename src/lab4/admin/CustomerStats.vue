<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const customers = ref([])
const isLoading = ref(true)
const message = ref('')
const isSuccess = ref(false)

// Giả sử mỗi đơn hàng trong db.json có dạng:
// { id, userId, total, date, status }
onMounted(async () => {
  try {
    const [usersRes, ordersRes] = await Promise.all([
      axios.get('http://localhost:3000/users'),
      axios.get('http://localhost:3000/orders')
    ])

    const users = usersRes.data
    const orders = ordersRes.data

    // Tính tổng chi tiêu từng khách
    customers.value = users.map(u => {
      const userOrders = orders.filter(o => o.userId === u.id && o.status !== 'Hủy')
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      return {
        name: u.name,
        username: u.username,
        totalOrders: userOrders.length,
        totalSpent
      }
    })

    isSuccess.value = true
  } catch (err) {
    console.error(err)
    message.value = 'Lỗi khi tải dữ liệu!'
    isSuccess.value = false
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 800px; width: 100%;">
      <h3 class="text-center fw-bold text-primary mb-3">Thống kê khách hàng</h3>
      <p class="text-center text-muted mb-4">Tổng hợp số đơn hàng và tổng chi tiêu của từng khách hàng</p>

      <transition name="fade">
        <div
          v-if="message"
          class="alert text-center fw-semibold py-2"
          :class="isSuccess ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </transition>

      <div v-if="isLoading" class="text-center text-muted py-3">Đang tải dữ liệu...</div>

      <table v-else class="table table-bordered align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Tên khách hàng</th>
            <th>Tên đăng nhập</th>
            <th>Số đơn hàng</th>
            <th>Tổng chi tiêu (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, index) in customers" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.username }}</td>
            <td>{{ c.totalOrders }}</td>
            <td class="text-success fw-semibold">
              {{ c.totalSpent.toLocaleString('vi-VN') }}
            </td>
          </tr>
          <tr v-if="!customers.length">
            <td colspan="5" class="text-muted py-3">Không có dữ liệu khách hàng</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.table th, .table td {
  vertical-align: middle;
}

.table-primary {
  background-color: #e7f1ff;
}

.table-bordered {
  border-color: #dee2e6;
}

.card {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

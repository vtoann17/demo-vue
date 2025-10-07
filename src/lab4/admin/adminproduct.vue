<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const products = ref([])
const message = ref('')
const router = useRouter()
const goTo = (path) => router.push(path)

onMounted(async () => {
  await loadProducts()
})

const handleDelete = async (id) => {
  const isConfirm = confirm(`Bạn có chắc muốn xoá sản phẩm ID = ${id}?`)
  if (isConfirm) {
    const response = await axios.delete(`http://localhost:3000/products/${id}`)
    if (response.status === 200) {
      await loadProducts()
      message.value = `Đã xoá sản phẩm ID ${id} thành công!`
      setTimeout(() => (message.value = ''), 3000)
    }
  }
}

const loadProducts = async () => {
  const response = await axios.get('http://localhost:3000/products')
  if (response.status === 200) {
    products.value = response.data
  }
}
</script>

<template>
  <header class="py-4 bg-white border-bottom shadow-sm mb-4">
    <div class="container d-flex justify-content-between align-items-center">
      <h3 class="fw-bold text-primary mb-0">Quản lý sản phẩm</h3>
      <router-link class="btn btn-primary btn-sm px-3" to="/addproduct">
        + Thêm sản phẩm
      </router-link>
    </div>
  </header>

  <main class="container pb-5">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Danh sách sản phẩm</h4>
      </div>

      <div class="card-body p-0">
        <transition name="fade">
          <div v-if="message" class="alert alert-success text-center py-2 mb-0 rounded-0">
            {{ message }}
          </div>
        </transition>

        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle mb-0 text-center">
            <thead class="table-light">
              <tr>
                <th style="width:160px">Ảnh</th>
                <th style="width:220px">Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th style="width:200px">Hành động</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in products" :key="item.id">
                <td>
                  <div v-if="Array.isArray(item.images) && item.images.length">
                    <img
                      :src="item.images[0]"
                      alt="product"
                      class="border rounded shadow-sm mb-1"
                      style="width:90px;height:90px;object-fit:cover;"
                    />
                    <small class="text-muted d-block" v-if="item.images.length > 1">
                      +{{ item.images.length - 1 }} ảnh
                    </small>
                  </div>
                  <div v-else>
                    <img
                      :src="item.image || 'https://via.placeholder.com/100?text=No+Image'"
                      class="border rounded shadow-sm"
                      style="width:90px;height:90px;object-fit:cover;"
                    />
                  </div>
                </td>

                <td class="fw-semibold text-start ps-3">{{ item.title }}</td>
                <td><span class="badge bg-secondary">{{ item.category || 'Chưa có' }}</span></td>

                <td class="text-danger fw-bold">
                  {{ Number(item.price).toLocaleString('vi-VN') }}₫
                </td>

                <td>
                  <span v-if="item.quantity > 0" class="text-dark">{{ item.quantity }}</span>
                  <span v-else class="text-danger">Hết hàng</span>
                </td>

                <td>
                  <button
                    @click="goTo(`/editproduct/${item.id}`)"
                    class="btn btn-sm btn-outline-primary me-2"
                  >
                    Sửa
                  </button>
                  <button
                    @click="handleDelete(item.id)"
                    class="btn btn-sm btn-outline-danger"
                  >
                    Xoá
                  </button>
                </td>
              </tr>

              <tr v-if="products.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  Chưa có sản phẩm nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
}

.table tbody tr:hover {
  background-color: #f9f9f9;
  transition: 0.2s;
}

img {
  border-radius: 8px;
}
</style>

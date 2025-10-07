<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const categories = ref([])
const message = ref('')
const router = useRouter()
const goTo = (path) => router.push(path)

onMounted(async () => {
  await loadData()
})

const handleDelete = async (id) => {
  const isConfirm = confirm(`Bạn có chắc muốn xoá danh mục ID = ${id}?`)
  if (isConfirm) {
    const response = await axios.delete(`http://localhost:3000/categories/${id}`)
    if (response.status === 200) {
      await loadData()
      message.value = `Đã xoá danh mục ID ${id} thành công!`
      setTimeout(() => (message.value = ''), 3000)
    }
  }
}

const loadData = async () => {
  const response = await axios.get('http://localhost:3000/categories')
  if (response.status === 200) {
    categories.value = response.data
  }
}
</script>

<template>
  <header class="py-4 bg-white border-bottom shadow-sm mb-4">
    <div class="container d-flex justify-content-between align-items-center">
      <h3 class="fw-bold text-primary mb-0">Quản lý danh mục</h3>
      <router-link class="btn btn-success btn-sm px-3" to="/addcategory">
        + Thêm danh mục
      </router-link>
    </div>
  </header>

  <main class="container pb-5">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Danh sách danh mục</h4>
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
                <th style="width:100px">ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th style="width:200px">Hành động</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in categories" :key="item.id">
                <td>{{ item.id }}</td>
                <td class="fw-semibold text-start ps-3">{{ item.name }}</td>
                <td class="text-muted text-start ps-3">{{ item.description || '—' }}</td>
                <td>
                  <button @click="goTo(`/editcategory/${item.id}`)" class="btn btn-sm btn-outline-primary me-2">
                    Sửa
                  </button>
                  <button @click="handleDelete(item.id)" class="btn btn-sm btn-outline-danger">
                    Xoá
                  </button>
                </td>
              </tr>

              <tr v-if="categories.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">
                  Chưa có danh mục nào
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
</style>

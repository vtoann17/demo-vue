<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const message = ref('')
const isSuccess = ref(false)
const categories = ref([])

const product = reactive({
  name: '',
  price: '',
  category: '',
  quantity: 1,
  image: '',
  description: ''
})

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/categories')
  if (res.status === 200) categories.value = res.data
})

const handleSubmit = async () => {
  if (!product.name.trim()) {
    message.value = 'Tên sản phẩm không được để trống!'
    isSuccess.value = false
    return
  }

  const response = await axios.post('http://localhost:3000/products', { ...product })
  if (response.status === 201) {
    message.value = 'Đã thêm sản phẩm thành công!'
    isSuccess.value = true
    clearForm()
    setTimeout(() => router.push('/admin/products'), 1500)
  } else {
    message.value = 'Có lỗi khi thêm sản phẩm!'
    isSuccess.value = false
  }
}

const clearForm = () => {
  Object.assign(product, {
    name: '',
    price: '',
    category: '',
    quantity: 1,
    image: '',
    description: ''
  })
}
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 550px; width: 100%;">
      <h3 class="text-center fw-bold text-primary mb-3">Thêm mô hình Gundam mới</h3>
      <p class="text-center text-muted mb-4">Nhập thông tin mô hình Gundam để thêm vào danh sách</p>

      <transition name="fade">
        <div
          v-if="message"
          class="alert text-center fw-semibold py-2"
          :class="isSuccess ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </transition>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-semibold">Tên mô hình <span class="text-danger">*</span></label>
          <input v-model="product.name" type="text" class="form-control" placeholder="Nhập tên Gundam..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Giá (VNĐ)</label>
          <input v-model="product.price" type="number" class="form-control" placeholder="Nhập giá..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Danh mục</label>
          <select v-model="product.category" class="form-select">
            <option disabled value="">-- Chọn danh mục --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Số lượng tồn kho</label>
          <input v-model="product.quantity" type="number" min="0" class="form-control" placeholder="Nhập số lượng..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Hình ảnh (URL)</label>
          <input v-model="product.image" type="text" class="form-control" placeholder="Dán link hình ảnh Gundam..." />
          <div v-if="product.image" class="mt-3 text-center">
            <img
              :src="product.image"
              alt="preview"
              class="rounded shadow-sm border"
              style="width: 180px; height: 180px; object-fit: cover;"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Mô tả</label>
          <textarea v-model="product.description" class="form-control" rows="3" placeholder="Mô tả ngắn..."></textarea>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <button type="submit" class="btn btn-primary px-4 fw-semibold">Lưu sản phẩm</button>
          <button @click="router.push('/admin/products')" type="button" class="btn btn-outline-secondary px-4">
            ← Quay lại
          </button>
        </div>
      </form>
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
.form-control:focus, .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
}
</style>

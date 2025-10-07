<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const message = ref('')
const isSuccess = ref(false)
const categories = ref([])

const product = reactive({
  title: '',
  price: '',
  image: '',
  category: '',
  description: '',
  quantity: 1
})
onMounted(async () => {
  const id = route.params.id
  const resProduct = await axios.get(`http://localhost:3000/products/${id}`)
  Object.assign(product, resProduct.data)
  const resCat = await axios.get('http://localhost:3000/categories')
  if (resCat.status === 200) categories.value = resCat.data
})

const handleUpdate = async () => {
  const id = route.params.id
  if (!product.title.trim()) {
    message.value = 'Tên sản phẩm không được để trống!'
    isSuccess.value = false
    return
  }

  const response = await axios.put(`http://localhost:3000/products/${id}`, { ...product })
  if (response.status === 200) {
    message.value = 'Cập nhật sản phẩm thành công!'
    isSuccess.value = true
    setTimeout(() => router.push('/admin/products'), 1500)
  } else {
    message.value = 'Có lỗi xảy ra khi cập nhật sản phẩm!'
    isSuccess.value = false
  }
}

const goTo = (path) => router.push(path)
</script>

<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 550px; width: 100%;">
      <h3 class="text-center fw-bold text-primary mb-3">Sửa sản phẩm</h3>
      <p class="text-center text-muted mb-4">Điền thông tin cần chỉnh sửa cho sản phẩm bên dưới</p>

      <transition name="fade">
        <div
          v-if="message"
          class="alert text-center fw-semibold py-2"
          :class="isSuccess ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </transition>

      <form @submit.prevent="handleUpdate">
        <div class="mb-3">
          <label class="form-label fw-semibold">Tên sản phẩm <span class="text-danger">*</span></label>
          <input v-model="product.title" type="text" class="form-control" placeholder="Nhập tên sản phẩm..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Giá (VNĐ)</label>
          <input v-model="product.price" type="number" class="form-control" placeholder="Nhập giá..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Số lượng tồn kho</label>
          <input v-model="product.quantity" type="number" min="0" class="form-control" placeholder="Nhập số lượng..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Danh mục</label>
          <select v-model="product.category" class="form-select">
            <option disabled value="">-- Chọn danh mục --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Hình ảnh (URL)</label>
          <input v-model="product.image" type="text" class="form-control" placeholder="Nhập link hình ảnh..." />
          <img
            v-if="product.image"
            :src="product.image"
            alt="preview"
            class="mt-2 rounded shadow-sm"
            style="width:100%; max-height:220px; object-fit:cover;"
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Mô tả</label>
          <textarea
            v-model="product.description"
            class="form-control"
            rows="3"
            placeholder="Nhập mô tả sản phẩm..."
          ></textarea>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <button type="submit" class="btn btn-primary px-4 fw-semibold">Lưu thay đổi</button>
          <button type="button" @click="goTo('/admin/products')" class="btn btn-outline-secondary px-4">
            ← Quay lại
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
}
</style>

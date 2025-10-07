<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="d-flex" style="min-height: 100vh;">
    <div class="bg-dark text-white p-3" style="width: 250px;">
      <h4 class="mb-4">Admin Panel</h4>
      
      <ul class="nav flex-column gap-2">
        <li class="nav-item">
          <button class="btn btn-dark w-100 text-start" @click="goTo('/admin/products')">
             Sản phẩm
          </button>
        </li>
        <li class="nav-item">
          <button class="btn btn-dark w-100 text-start" @click="goTo('/admin/categories')">
            Danh mục
          </button>
        </li>
        <li class="nav-item">
          <button class="btn btn-dark w-100 text-start" @click="goTo('/productlist')">Trang chủ
          </button>
        </li>
      </ul>
    </div>
    <div class="flex-grow-1 p-4">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
.btn-dark {
  background-color: transparent;
  border: none;
  color: white;
}
.btn-dark:hover {
  background-color: rgba(255,255,255,0.1);
}
</style>

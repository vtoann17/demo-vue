<script setup>
import { ref } from "vue";
const message = ref("bạn chưa có tin nhắn")
const dem = ref(0)
const tuoi = ref(0)
const product = ref({
  
})
const changeMessage = () => {
  message.value = "đã đổi thông báo"
}
const handleTang = () => {
  tuoi.value++
}
const handleGiam = () => {
  tuoi.value--
}

</script>

<template>
  <h1>Hiển thị tin nhắn</h1>
  <p>{{ message }}</p>
  <p class="dem">{{ dem }}.{{ tuoi }}</p>
  <button @click="changeMessage">Thay đổi thông báo</button>
  <button @click="handleTang">Tăng số</button>
  <button @click="handleGiam">Giảm số</button>
  <hr>
  <!-- Điều kiện  -->
  <p v-if="tuoi<12">Học cấp 1</p>
  <p v-else-if="tuoi<15">Học cấp 2</p>
  <p v-else-if="tuoi<19">Học cấp 3</p>
  <p v-else="">Đã tốt nghiệp</p>
  <div v-show="tuoi>19">
    <img src="https://thietbiquayphim.com/wp-content/uploads/2022/06/cach-chup-anh-tot-nghiep-dep.png" alt="" width="300px">
  </div>
</template>
<style scoped>
.dem {
  font-size: 40px;
  font-weight: bold;
  color: red;
  text-align: center;
}
</style>
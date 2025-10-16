<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

onMounted(() => {
  localStorage.removeItem("currentUser");

  store.dispatch("cart/clearCart");

  setTimeout(() => router.push("/"), 1000);
});
</script>

<template>
  <div class="container py-4 text-center">
    <h3>Bạn đã đăng xuất thành công!</h3>
    <p>Đang chuyển hướng về trang chủ...</p>
  </div>
</template>

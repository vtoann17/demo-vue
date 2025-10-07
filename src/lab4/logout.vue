<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  localStorage.removeItem("user");
  router.push("/login");
});
</script>

<template>
  <div class="container py-4 text-center">
    <h3>Bạn đã đăng xuất thành công!</h3>
    <p>Đang chuyển hướng về trang đăng nhập...</p>
  </div>
</template>

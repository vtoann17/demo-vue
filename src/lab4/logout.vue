<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  localStorage.removeItem("currentUser");
  setTimeout(() => router.push("/"), 1000);
});
</script>

<template>
  <div class="container py-4 text-center">
    <h3>Bạn đã đăng xuất thành công!</h3>
    <p>Đang chuyển hướng về trang chủ...</p>
  </div>
</template>

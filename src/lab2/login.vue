<script setup>
import { ref } from "vue";
const username = ref('')
const password = ref('')
const message = ref('')
const isSuccess = ref(false)

const handleDangNhap = () => {
  if (username.value === "") {
    message.value = "username không được để trống"
  } else if (password.value === "") {
    message.value = "password không được để trống"
  } else if (username.value === "admin" && password.value === "123456") {
    message.value = "Đăng nhập thành công"
    isSuccess.value = true
  } else {
    message.value = "Đăng nhập thất bại"
    isSuccess.value = false
  }
};

</script>

<template>
    <form action="">
        <h1>Login</h1>
        <span :class="{success: isSuccess, error: !isSuccess}">{{ message }}</span>
        <input type="text" v-model="username" placeholder="username...">
        <br>
        <input type="password" v-model="password" placeholder="password...">
        <br>
        <input @click="handleDangNhap" type="button" value="đăng nhập">
    </form>
</template>
<style scoped>
form input{
    display: block;
    margin-top: 20px;
}
.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

</style>

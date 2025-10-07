<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const message = ref('')
const isSuccess = ref(false)
const checkLogin = async (username, password) => {
  const response = await axios.get('http://localhost:3000/users');
  if (response.status == 200) {
    const user = response.data.find(item => item.username === username && item.password === password)
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true
    }
  }
  return false
}

const handleDangNhap = async () => {
  if (username.value === "") {
    message.value = "Tên không được để trống"
  }
  else if (password.value === "") {
    message.value = "Mật khẩu không được để trống"
  }
  const login = await checkLogin(username.value, password.value);

  if (login) {
    message.value = 'Đăng nhập thành công';
    isSuccess.value = true;
    setTimeout(() => {
      router.push('/productlist')
    }, 2000)
  } else {
    message.value = 'Đăng nhập thất bại';
    isSuccess.value = false;
  }
}


</script>
<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Đăng nhập</h2>
      <form @submit.prevent="handleDangNhap">
        <p class="message" :class="{ success: isSuccess, error: !isSuccess }">
          {{ message }}
        </p>
        <div class="form-group">
          <input type="text" v-model="username" placeholder="Tên đăng nhập" class="form-control" />
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Mật khẩu" class="form-control" />
        </div>
        <button type="submit" class="btn-submit">Đăng nhập</button>
        
      </form>
      <p class="text-note">
        Bạn chưa có tài khoản?
        <RouterLink to="/register" class="link">Đăng ký</RouterLink>
      </p>
    </div>
  </div>
</template>
<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.auth-box {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.btn-submit:hover {
  background: #1d4ed8;
}

.text-note {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.link {
  color: #2563eb;
  font-weight: bold;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.message {
  display: block;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
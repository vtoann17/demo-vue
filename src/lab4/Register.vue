<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const user = reactive({
    name: '',
    username: '',
    password: '',
    role: 'user'
})
const message = ref('')
const isSuccess = ref(false)
const handleRegister = async () => {
    if (user.name === "" || user.username === "" || user.password === "") {
        message.value = "Họ và tên, Tên đăng nhập và mật khẩu không được để trống";
        isSuccess.value = false
        return
    }
    const payload = {
        name: user.name,
        username: user.username,
        password: user.password,
        role: 'user'
    }
    const response = await axios.post('http://localhost:3000/users', payload)
    if (response.status == 201) {
        message.value = "Đăng kí thành công, vui lòng đăng nhập!"
        isSuccess.value = true
        localStorage.setItem('currentUser', JSON.stringify(payload))
        clearData()
        setTimeout(() => {
            router.push('/login')
        }, 2000)
    } else {
        message.value = "Đăng kí thất bại, vui lòng thử lại!"
        isSuccess.value = false
    }
}
const clearData = () => {
    Object.assign(user, {
        name: '',
        username: '',
        password: '',
        role: 'user'
    })
}
</script>

<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow p-4 rounded">
            <h3 class="text-center mb-4">Đăng ký</h3>
            <form @submit.prevent="handleRegister">
                <p class="message text-center mt-2" :class="{ 'text-success': isSuccess, 'text-danger': !isSuccess }">
                    {{ message }}
                </p>
                <div class="mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input v-model="user.name" type="text" class="form-control" placeholder="Nhập họ và tên" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Tên đăng nhập</label>
                    <input v-model="user.username" type="text" class="form-control" placeholder="Nhập tên đăng nhập" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu</label>
                    <input v-model="user.password" type="password" class="form-control" placeholder="Nhập mật khẩu" />
                </div>
                <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
            </form>
            <p class="text-center mt-3">
                Đã có tài khoản?
                <a href="/login">Đăng nhập</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.card {
    border-radius: 12px;
    border: none;
}

.btn-primary {
    background-color: #007bff;
    border: none;
    font-weight: 500;
}

.btn-primary:hover {
    background-color: #0056b3;
}
</style>

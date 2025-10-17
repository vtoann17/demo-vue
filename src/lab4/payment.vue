<script setup>
import axios from "axios"
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useStore } from "vuex"

const route = useRoute()
const router = useRouter()
const store = useStore()

const message = ref('')
const status = ref('loading')

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost/vnpay/return_Vnpay.php`, {
      params: route.query
    })
    message.value = res.data.message
    status.value = res.data.status

    if (status.value === 'success') {
      store.dispatch('cart/clearCart')
      localStorage.removeItem('cart')

      router.push('/paymentSucces?method=bank')
      //   setTimeout(() => router.push('/'), 1500)
    } else {
      router.push('/paymentFailed')
    }
  } catch (error) {
    console.log('Lỗi khi xác nhận thanh toán:', error)
  }
})
</script>

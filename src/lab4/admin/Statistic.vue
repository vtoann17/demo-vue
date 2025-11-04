<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const totalUsers = ref(0)
const totalCategories = ref(0)
const totalProducts = ref(0)
const totalRevenue = ref(0)
const customers = ref([])
const router = useRouter()

const goTo = (path) => router.push(path)
const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
}

onMounted(async () => {
    loadTopProducts()
    const [userRes, catRes, prodRes, orderRes] = await Promise.all([
        axios.get('http://localhost:3000/users'),
        axios.get('http://localhost:3000/categories'),
        axios.get('http://localhost:3000/products'),
        axios.get('http://localhost:3000/orders')
    ])

    totalUsers.value = userRes.data.length
    totalCategories.value = catRes.data.length
    totalProducts.value = prodRes.data.length

    const doneOrders = orderRes.data.filter(o => o.status === 'Hoàn tất')
    totalRevenue.value = doneOrders.reduce((sum, o) => sum + (o.grand_total || 0), 0)

    const spendMap = {}
    doneOrders.forEach(order => {
        if (!spendMap[order.userId]) {
            spendMap[order.userId] = {
                name: order.name,
                totalSpend: 0,
                totalOrders: 0
            }
        }
        spendMap[order.userId].totalSpend += order.grand_total
        spendMap[order.userId].totalOrders++
    })
    customers.value = Object.values(spendMap)
})
const topProducts = ref([])

const loadTopProducts = async () => {
  const ordersRes = await axios.get(`http://localhost:3000/orders`)
  const productsRes = await axios.get(`http://localhost:3000/products`)

  if (ordersRes.status === 200 && productsRes.status === 200) {
    const orders = ordersRes.data
    const products = productsRes.data
    const count = {}

    for (const o of orders) {
      for (const i of o.cart) {
        count[i.id] = (count[i.id] || 0) + i.quantity
      }
    }

    topProducts.value = products
      .map(p => ({ ...p, sold: count[p.id] || 0 }))
      .filter(p => p.sold > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
  }
}

</script>

<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <h3 class="logo">Admin Panel</h3>
            <nav>
                <ul>
                    <li @click="goTo('/')"><i class="bi bi-house-door"></i> Trang chủ</li>
                    <li class="active" @click="goTo('/admin/statistic')">
                        <i class="bi bi-speedometer2"></i> Tổng quan
                    </li>
                    <li @click="goTo('/admin/products')">
                        <i class="bi bi-box"></i> Sản phẩm
                    </li>
                    <li @click="goTo('/admin/categories')">
                        <i class="bi bi-tags"></i> Danh mục
                    </li>
                    <li @click="goTo('/admin/orders')">
                        <i class="bi bi-receipt"></i> Đơn hàng
                    </li>
                    <li @click="goTo('/admin/users')">
                        <i class="bi bi-people"></i> Người dùng
                    </li>
                    <li @click="handleLogout">
                        <i class="bi bi-box-arrow-right"></i> Đăng xuất
                    </li>
                </ul>
            </nav>
        </aside>

        <main class="content">
            <h1 class="text-2xl font-bold mb-6">Thống kê tổng quan</h1>

            <div class="stats-row">
                <div class="stat-card">
                    <h2>Người dùng</h2>
                    <p class="text-blue-500">{{ totalUsers }}</p>
                </div>
                <div class="stat-card">
                    <h2>Danh mục</h2>
                    <p class="text-green-500">{{ totalCategories }}</p>
                </div>
                <div class="stat-card">
                    <h2>Sản phẩm</h2>
                    <p class="text-orange-500">{{ totalProducts }}</p>
                </div>
                <div class="stat-card">
                    <h2>Doanh thu</h2>
                    <p class="text-rose-500">
                        {{ totalRevenue.toLocaleString('vi-VN') }} đ
                    </p>
                </div>
            </div>


            <div class="card">
                <h2 class="text-xl font-semibold mb-4 text-gray-800">Thống kê khách hàng & chi tiêu</h2>
                <div class="table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên khách hàng</th>
                                <th>Số đơn hàng</th>
                                <th>Tổng chi tiêu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(cus, index) in customers" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ cus.name }}</td>
                                <td>{{ cus.totalOrders }}</td>
                                <td class="text-red-600 fw-semibold">
                                    {{ cus.totalSpend.toLocaleString('vi-VN') }} đ
                                </td>
                            </tr>
                            <tr v-if="customers.length === 0">
                                <td colspan="4" class="text-center py-3 text-muted">
                                    Không có dữ liệu khách hàng
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <section class="bestsellers container py-5">
            <h2 class="section-title text-center fw-bold mb-4">Sản phẩm bán chạy</h2>
            <div class="row g-4">
                <div v-for="p in topProducts" :key="p.id" class="col-6 col-md-3 col-lg-2">
                    <div class="product-card p-3 text-center bg-white shadow-sm rounded-4">
                        <img :src="p.image" :alt="p.name" class="img-fluid rounded mb-2"
                            style="height: 200px; object-fit: cover;" />
                        <h6 class="fw-semibold">{{ p.name }}</h6>
                        <p class="text-muted mb-1">{{ p.price.toLocaleString() }}₫</p>
                        <p class="small text-success mb-2">Đã bán: {{ p.sold }}</p>
                    </div>
                </div>
            </div>
        </section>
        </main>
    </div>
     
</template>

<style scoped>
.admin-layout {
    display: flex;
    height: 100vh;
    background: #f9fafb;
    font-family: 'Inter', sans-serif;
}

.sidebar {
    width: 230px;
    background: linear-gradient(180deg, #0d6efd, #003d9c);
    color: #fff;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
}

.sidebar .logo {
    font-size: 22px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 25px;
    letter-spacing: 1px;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar li {
    padding: 12px 25px;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
}

.sidebar li:hover,
.sidebar li.active {
    background: rgba(255, 255, 255, 0.2);
    border-left: 4px solid #fff;
}

.sidebar i {
    font-size: 18px;
}

.content {
    flex: 1;
    margin-left: 230px;
    padding: 25px;
    overflow-y: auto;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
}

.stat-card h2 {
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
}

.stat-card p {
    font-size: 22px;
    font-weight: bold;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
}

.table-wrapper {
    overflow-x: auto;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th,
.admin-table td {
    padding: 12px;
    border: 1px solid #e0e0e0;
    text-align: center;
}

.admin-table th {
    background: #e9f1ff;
    font-weight: 600;
}

.admin-table tbody tr:hover {
    background-color: #f6faff;
    transition: 0.2s;
}

@media (max-width: 992px) {
    .sidebar {
        position: static;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
    }

    .content {
        margin-left: 0;
        padding: 15px;
    }
}
.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  min-width: 220px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}
.card.mt-6 {
  margin-top: 30px;
}

.bestsellers {
  margin-top: 10px;
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.product-card img {
  border-radius: 12px;
}


</style>

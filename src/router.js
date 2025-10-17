import { createWebHistory, createRouter } from 'vue-router'

import NotFound from './components/NotFound.vue'
import Register from "./lab4/Register.vue";
import Login from './lab4/login.vue'
import Logout from "./lab4/logout.vue";
import ProductList from "./lab4/Productlist.vue"
import Profile from './lab4/user/profile.vue'
import Addproduct from './lab4/admin/addproduct.vue';
import AdminProducts from "./lab4/admin/adminproduct.vue";
import AdminCategories from "./lab4/admin/admincategory.vue";
import Editproduct from './lab4/admin/editproduct.vue';
import Productdetail from './lab4/productdetail.vue';
import Addcategory from './lab4/admin/addcategory.vue';
import Editcategory from './lab4/admin/editcategory.vue';
import Home from './lab4/home.vue';
import Adminuser from './lab4/admin/adminuser.vue';
import Adduser from './lab4/admin/adduser.vue';
import Cart from './lab4/cart.vue';
import Wishlist from './lab4/user/wishlist.vue';
import Adminorder from './lab4/admin/adminorder.vue';
import Order from './lab4/user/order.vue';
import Payment from './lab4/payment.vue';
import PaymentSucces from './lab4/paymentSucces.vue';
import PaymentFailed from './lab4/paymentFailed.vue';
import AdminCustomerstats from "./lab4/admin/CustomerStats.vue";


const routes = [
  { path: '/', name: 'Home', component: Home, meta: { isAuth: false } },
  { path: '/register', name: 'Register', component: Register, meta: { isAuth: false } },
  { path: '/login', name: 'Login', component: Login, meta: { isAuth: false } },
  { path: '/logout', name: 'Logout', component: Logout, meta: { isAuth: true } },
  { path: '/user/profile', name: 'Profile', component: Profile, meta: { isAuth: true } },
  { path: '/productlist', name: 'ProductList', component: ProductList, meta: { isAuth: false } },
  { path: '/addproduct', name: 'Addproduct', component: Addproduct, meta: { isAuth: true } },
  { path: '/admin/products', name: 'AdminProducts', component: AdminProducts, meta: { isAuth: true, requiresAdmin: true } },
  { path: '/admin/categories', name: 'AdminCategories', component: AdminCategories, meta: { isAuth: true, requiresAdmin: true } },
  { path: '/admin/customerstats', name: 'AdminCustomerstats', component: AdminCustomerstats, meta: { isAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'Adminuser', component: Adminuser, meta: { isAuth: true, requiresAdmin: true } },
  { path: '/admin/orders', name: 'Adminorders', component: Adminorder, meta: { isAuth: true, requiresAdmin: true } },
  { path: '/editproduct/:id', name: 'Editproduct', component: Editproduct, meta: { isAuth: true } },
  { path: '/products/:id', name: 'ProductDetail', component: Productdetail, meta: { isAuth: false } },
  { path: '/addcategory', name: 'Addcategory', component: Addcategory, meta: { isAuth: true } },
  { path: '/addusers', name: 'Addusers', component: Adduser, meta: { isAuth: true } },
  { path: '/editcategory/:id', name: 'Editcategory', component: Editcategory, meta: { isAuth: true } },
  { path: '/cart', name: 'Cart', component: Cart, meta: { isAuth: true } },
  {path: '/user/wishlist', name: 'Wishlist', component: Wishlist, meta: {isAuth: false}},
  {path: '/user/order', name: 'Order', component: Order, meta: {isAuth: false}},
  {path: '/payment', name: 'Payment', component: Payment },
  {path: '/paymentSucces', name: 'Paymentsucces', component: PaymentSucces},
    {path: '/paymentFailed', name: 'Paymentfailed', component: PaymentFailed},
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Kiểm tra đăng nhập
router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('currentUser');
  if (to.meta.isAuth) {
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (!user.role) return next({ name: 'Login' });
    } else {
      return next({ name: 'Login' });
    }
  }
  next();
});

// Kiểm tra quyền admin
router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('currentUser');
  const user = currentUser ? JSON.parse(currentUser) : null;

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    alert("Chỉ quản trị viên mới được phép vào trang này!");
    return next({ path: '/' });
  }

  next();
});

export default router

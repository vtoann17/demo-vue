import { createWebHistory, createRouter } from 'vue-router'

import ListPostView from './pages/Listpost.vue'
import PostDetailView from './pages/postdetail.vue'
import NotFound from './components/NotFound.vue'
import Register from "./lab4/Register.vue";
import Login from './lab4/login.vue'
import Logout from "./lab4/logout.vue";
import ProductList from "./lab4/Productlist.vue"
import Profile from './lab4/profile.vue'
import Addproduct from './lab4/admin/addproduct.vue';
import Admin from './lab4/admin/admin.vue';
import AdminProducts from "./lab4/admin/adminproduct.vue";
import AdminCategories from "./lab4/admin/admincategory.vue";
import Editproduct from './lab4/admin/editproduct.vue';
import Productdetail from './lab4/productdetail.vue';
import Addcategory from './lab4/admin/addcategory.vue';
import Editcategory from './lab4/admin/editcategory.vue';

const routes = [
  { path: '/', name: 'Home', component: ProductList, meta: { isAuth: false } },
  { path: '/posts', name: 'Posts', component: ListPostView, meta: { isAuth: false } },
  { path: '/posts/:id', name: 'PostDetail', component: PostDetailView, meta: { isAuth: false } },
  { path: '/register', name: 'Register', component: Register, meta: { isAuth: false } },
  { path: '/login', name: 'Login', component: Login, meta: { isAuth: false } },
  { path: "/logout", name: 'Logout', component: Logout, meta: { isAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { isAuth: true } },
  { path: '/productlist', name: 'ProductList', component: ProductList, meta: { isAuth: true } },
  { path: '/addproduct', name: 'Addproduct', component: Addproduct, meta: { isAuth: true } },
  {
    path: '/admin', name: 'Admin', component: Admin, meta: { isAuth: true },
    children: [
      {
        path: 'products', name: 'AdminProducts', component: AdminProducts, meta: { isAuth: true }
      },
      {
        path: 'categories', name: 'AdminCategories', component: AdminCategories, meta: { isAuth: true }
      }
    ]
  },
  { path: '/editproduct/:id', name: 'Editproduct', component: Editproduct, meta: {isAuth: true}},
  {
    path: '/products/:id',name: 'ProductDetail',component: Productdetail, meta: {isAuth: false}
  },
  { path: '/addcategory', name: 'Addcategory', component: Addcategory, meta: {isAuth: true}},
  { path: '/editcategory/:id', name: 'Editcategory', component: Editcategory, meta: {isAuth: true}},
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { isAuth: false }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * check permission
 */
router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('currentUser');
  if (to.meta.isAuth) {
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (!user.role) {
        return next({ name: 'Login' });
      }
    } else {
      return next({ name: 'Login' });
    }
  }
  next();
});

export default router

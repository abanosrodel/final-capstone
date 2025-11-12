import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Profile from '@/views/Profile.vue'
import ProfileInfo from '@/pages/ProfileInfo.vue'
import ProfileNotifications from '@/pages/ProfileNotifications.vue'
import ProfileMessages from '@/pages/ProfileMessages.vue'
import ProfileOrders from '@/pages/ProfileOrders.vue'
import ProfileCustomizations from '@/pages/ProfileCustomizations.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue'), meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: () => import('@/views/auth/Register.vue'), meta: { guestOnly: true } },
  { path: '/verify-email', name: 'verify-email', component: () => import('@/views/auth/VerifyEmail.vue'), meta: { guestOnly: true } },
  { path: '/forgot', name: 'forgot', component: () => import('@/views/auth/ForgotPassword.vue')},
  { path: '/reset-password/:token', name: 'ResetPassword', component: () => import('@/views/auth/ResetPassword.vue')},
  { path: '/shop', name: 'shop', component: () => import('@/views/Shop.vue'),  meta: { requiresAuth: true } },
  { path: '/store', name: 'store', component: () => import('@/views/Store.vue') },
    { path: '/thank-you', name: 'thank-you', component: () => import('@/views/ThankYou.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/Checkout.vue'),  meta: { requiresAuth: true } },
  { path: '/product/:id', name: 'product-view', component: () => import('@/views/ProductView.vue'),  meta: { requiresAuth: true } },
  { path: '/customize', name: 'customize', component: () => import('@/views/Customize.vue'), meta: { requiresAuth: true } },

  // ❌ Require login
  { path: '/cart', name: 'cart', component: () => import('@/views/Cart.vue'), meta: { requiresAuth: true } },

  {
    path: '/dashboard',
    component: () => import('@/views/admin/layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'customer', name: 'customer', component: () => import('@/views/admin/Customer.vue') },
      { path: 'category', name: 'category', component: () => import('@/views/admin/Category.vue') },
      { path: 'sizes', name: 'sizes', component: () => import('@/views/admin/Sizes.vue') },
      { path: 'product-sizes', name: 'product-sizes', component: () => import('@/views/admin/ProductSizes.vue') },
      { path: 'product', name: 'product', component: () => import('@/views/admin/Product.vue') },
      { path: 'order', name: 'order', component: () => import('@/views/admin/Order.vue') },
      { path: 'message', name: 'message', component: () => import('@/views/admin/Messages.vue') },
      { path: 'customization', name: 'customization', component: () => import('@/views/admin/Customization.vue') },

    ],
  },

  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true },
    children: [
      { path: 'info', component: ProfileInfo },
      { path: 'notifications', component: ProfileNotifications },
      { path: 'messages', component: ProfileMessages },
      { path: 'orders', component: ProfileOrders },
      { path: 'customizations', component: ProfileCustomizations },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Global Route Guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  // 🔒 Block logged-in users from accessing login/register
  if (to.meta.guestOnly && user) {
    return next('/')
  }

  // 🔒 Block unauthenticated users from accessing auth-required routes
  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  // 🔒 Block non-admins from admin pages
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    return next('/')
  }

  next()
})

export default router

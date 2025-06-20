import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'
import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'home',
    path: '/',
    component: () => import('../pages/admin/frontend/pages/home.vue'),
    beforeEnter: guestForNormalUser
  },
  {
    name: 'product-details',
    path: '/product-details/:id',
    component: () => import('../pages/admin/frontend/pages/product-details.vue'),
    beforeEnter: guestForNormalUser
  },
  {
    name: 'not-found-advanced',
    path: '/404',
    component: Page404Layout,
    children: [
      {
        name: 'not-found-advanced',
        path: 'not-found-advanced',
        component: () => import('../pages/404-pages/VaPageNotFound.vue'),
      },
    ],
  },
  // Admin routes
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'statistics',
        path: 'users_management',
        component: RouteViewComponent,
        // Remove empty children array if not needed, or add actual routes
      },
      {
        name: 'settings',
        path: 'settings',
        component: RouteViewComponent,
        // Remove empty children array if not needed, or add actual routes
      },
      ...(Array.isArray(UIRoute) ? UIRoute : [UIRoute]), // Handle UIRoute properly
    ],
  },
  // Auth routes (accessible to all)
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'register-storehouse',
        path: 'register-storehouse',
        component: () => import('../pages/auth/signup/register-storehouse.vue'),
      },
      {
        name: 'register-pharmacy',
        path: 'register-pharmacy',
        component: () => import('../pages/auth/signup/register-pharmacy.vue'),
      },
      {
        name: 'inquiry',
        path: 'inquiry',
        component: () => import('../pages/auth/login/inquiry.vue'),
      },
      {
        name: 'inquiry-warehous',
        path: 'inquiry-warehous/:id',
        component: () => import('../pages/auth/login/inquiry-warehous.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

function guestForNormalUser(to: any, from: any, next: any) {
  if (localStorage.getItem('token')) {
    next()
  } else {
    next({ name: 'login' }) // Redirect to login if no token
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // Ensure the scroll happens and return the position
    const element = document.querySelector('.app-layout__page')
    if (element) {
      element.scrollTo(0, 0)
    }
    return { top: 0, left: 0 }
  },
  routes,
})

export default router

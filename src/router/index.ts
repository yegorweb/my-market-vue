import { createRouter, createWebHistory, RouteLocation, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../stores/auth'

async function checkAuth(): Promise<string | void> {
  let auth = useAuth()
  await auth.checkAuth()
  
  if (!auth.user) {
    return '/login'
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/HomePage.vue')
      },
      {
        path: 'user/:id',
        name: 'Account',
        props: true,
        component: () => import('@/pages/account/AccountPage.vue'),
      },
      {
        path: 'product/:id',
        name: 'Product',
        props: true,
        component: () => import('@/pages/ProductPage.vue'),
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/pages/CreatingPage.vue'),
        beforeEnter: checkAuth
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/LoginPage.vue')
      },
      {
        path: 'registration',
        name: 'Registration',
        component: () => import('@/pages/RegistrationPage.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/404.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

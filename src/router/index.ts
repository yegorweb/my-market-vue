import { createRouter, createWebHistory, RouteLocation, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../stores/auth'
import { storeToRefs } from 'pinia'

async function checkAuth(to: RouteLocationNormalized): Promise<string | void> {
  let auth = useAuth()
  let { user, redirectTo } = storeToRefs(auth)
  await auth.checkAuth()
  
  if (!user.value) {
    redirectTo.value = to.path
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
        path: 'my-page',
        redirect: to => {
          let auth = useAuth()
          let { user, redirectTo } = storeToRefs(auth)
          
          if (!user.value) {
            redirectTo.value = '/my-page'
            return { path: '/login' }
          }
          return { path: `/user/${user.value._id}` }
        }
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

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'scale-slide' : 'slide'
})

export default router

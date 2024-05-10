<script setup lang="ts">
import BackButton from '../../components/BackButton.vue';
import { useAuth } from '../../stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '../../stores/user';
import { User } from '../../types/user.interface';
import { storeToRefs } from 'pinia';

let router = useRouter()
let auth = useAuth()
let userStore = useUser()

let props = defineProps(['id'])
let id = props.id

let { user:viewer } = storeToRefs(auth)
let my_page = viewer.value?._id === id
let user = ref(viewer.value && viewer.value._id === id ? viewer.value : await userStore.getById(id) as User)

document.title = `${user.value.name} — Мой Маркет`


async function logout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="w-100">
    <v-container class="mt-1">
      <!-- =================== Top bar ==================== -->
  
      <div class="d-flex flex-row w-100 flex-nowrap justify-space-between align-center">
        <BackButton />
        
        <div 
          v-if="my_page" 
          @click="logout" 
          class="d-flex pt-1 pr-1 pb-1 cursor-pointer flex-row flex-nowrap align-center justify-start"
        >
          <v-icon>mdi-logout</v-icon>
          
          <div class="text-body-4 ml-1 font-weight-semibold">
            выйти
          </div>
        </div>
      </div>
  
      <div class="mt-4 d-flex align-center">
        <v-avatar size="60" color="green" style="font-size: 26px; font-weight: 700; color: #FFFFFF;">
          {{ user.name.split(' ').map(item => item[0]).join('') }}
        </v-avatar>

        <div class="ml-4" style="font-size: 22px; font-weight: 600;">
          {{ user.name }}
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="scss"></style>

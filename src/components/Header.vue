<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useAuth } from '../stores/auth';
import { useScroll } from '@vueuse/core'

let auth = useAuth()
let { user } = storeToRefs(auth)

let router = useRouter()
const { x, y } = useScroll(document)
</script>

<template>
  <div :style="`background: ${ y > 0 ? '#FFFFFF' : 'none'}; position: fixed; top: 0; left: 0; right: 0; height: 60px; z-index: 999;`">
    <v-container class="d-flex align-center justify-space-between user-select-none" style="height: 60px; position: relative;">
      <div @click="router.push('/')" class="d-flex align-center cursor-pointer">
          <img src="/logo.svg" style="height: 40px;" />
  
          <div class="font-weight-bold" style="font-size: 18px; margin-left: 15px;">МойМаркет</div>
      </div>
  
      <div :class="`d-flex align-center pa-2 cursor-pointer ${useDisplay().smAndUp.value ? 'abs-location' : ''}`">
          <span class="mdi mdi-map-marker-outline" style="font-size: 20px;" />&nbsp;Глазов
      </div>
      
      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon v-bind="props" :ripple="false" variant="plain" />
        </template>

        <v-list variant="tonal" elevation="0" class="rounded-lg pa-0">
          <v-list-item prepend-icon="mdi-home" to="/" :exact="true" :ripple="false">
            Главная
          </v-list-item>

          <v-list-item prepend-icon="mdi-plus" to="/create" :ripple="false">
            Создать
          </v-list-item>

          <v-list-item prepend-icon="mdi-account" :ripple="false" :to="user ? `/user/${user._id}` : '/login'">
            Кабинет
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.abs-location {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue';
import { useAuth } from '../stores/auth';
import { User } from '../types/user.interface';

let router = useRouter()

let auth = useAuth()
await auth.checkAuth()

let { user } = storeToRefs(auth)
</script>

<template>
  <v-app>
    <Header style="padding-left: calc(100vw - 100%);" />

    <!-- Content -->
    <v-main style="padding-bottom: 80px; padding-top: 60px;">
      <Suspense>
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition">
            <component :is="Component" />
          </transition>
        </router-view>
      </Suspense>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { useAuth } from '../stores/auth'

document.title = 'Авторизация — Мой Маркет'

let auth = useAuth()
let router = useRouter()

const { meta, handleSubmit, handleReset } = useForm({
  validationSchema: {
    password(value: string) {
      if (value?.length >= 8) return true
      return 'нужно 8 символов'
    },
    email(value: string) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return true
      return 'неправильный формат email'
    },
  },
})

const email = useField('email')
const password = useField('password')
let show_password = ref(false)

let loading = ref(false)

const login = handleSubmit(async values => {
  loading.value = true

  let result = await auth.login(values.email, values.password)
  if (result)
    router.push(result)
  
  loading.value = false
})
</script>

<template>
  <div class="w-100">
  <v-container class="align-start">
    <BackButton></BackButton>

    <v-col cols="12" xs="12" md="6" lg="4" class="mt-4 ma-auto">
      <v-card 
        style="border-radius: 12px; box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);"
        class="d-flex flex-column justify-center align-center text-center w-100 pl-6 pr-6 pt-4 pb-6"
      >
        <div class="text-h6 font-weight-bold">Вход</div>
  
        <v-form @submit.prevent="login" class="d-flex mt-3 flex-column align-center justify-center w-100">
          <v-text-field 
            label="Email"
            type="email"
            id="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />          

          <v-text-field 
            label="Пароль"
            id="password"
            v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password"
            :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />

          <v-btn type="submit" :disabled="!meta.valid" color="accent" class="mt-4">Войти</v-btn>
        </v-form>
  
        <div 
          @click="router.push('/registration')" 
          :loading="loading"
          class="text-body-2 w-100 cursor-pointer font-weight-semibold pa-1 mt-4"
        >
          регистрация
        </div>
      </v-card>
    </v-col>
  </v-container>
  </div>
</template>

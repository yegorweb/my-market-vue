<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import { useAuth } from '../stores/auth'
import { useField, useForm, FieldContext } from 'vee-validate'
import { storeToRefs } from 'pinia'

document.title = 'Регистрация — Мой Маркет'

let router = useRouter()
let auth = useAuth()

let { user } = storeToRefs(auth)

const { meta, handleSubmit, handleReset, validate } = useForm<{
  name: string,
  email: string,
  password: string,
}>({
  initialValues: {
    name: '',
    email: '',
    password: '',
  },
  validationSchema: {
    name(value: string) {
      if (value.length === 0) return 'введите фамилию, имя'
      if (value.length < 4) return 'слишком коротко'
      if (value.length > 22) return 'слишком длинно'

      return true
    },
    email(value: string) {
      if (value.length === 0) return 'введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'неверно ведено'

      return true
    },
    password(value: string) {
      if (value.length === 0) return 'введите пароль'
      if (value.length < 8) return 'минимум 8 символов'
      if (value.length > 30) return 'слишком длинный пароль'

      return true
    },
  }
})

let name: FieldContext<string> = useField('name')
let email: FieldContext<string> = useField('email')
let password: FieldContext<string> = useField('password')

let show_password = ref(false)

let loading = ref(false)

const submit = handleSubmit(async values => {
  loading.value = true
  
  await auth.registration(values)
  .then(() => { 
    if (user.value) router.push(`/user/${user.value._id}`)
  })

  loading.value = false 
})
</script>

<template>
  <div class="w-100">
  <v-container>
    <BackButton />

    <v-col 
      cols="12" xs="12" sm="10" md="7" lg="5" 
      class="mt-4 ma-auto"
    >
      <v-card 
        class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pl-6 pr-6 
        pt-4 pb-6 rounded-lg"
      >
        <div 
          class="text-h6 font-weight-bold"
        >
          Регистрация
        </div>
  
        <v-form
          class="mt-6 w-100"
          @submit="submit"
        >
          <v-text-field 
            label="Имя Фамилия"
            type="name"
            placeholder="Иван Иванов"
            v-model="name.value.value"
            :error-messages="name.errors.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />    

          <v-text-field 
            label="Email"
            type="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errors.value"
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />          

          <v-text-field 
            label="Пароль"
            v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password"
            :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100 mt-1"
          />

          <v-btn 
            type="submit" 
            :disabled="!meta.valid" 
            :loading="loading"
            color="accent"
            class="mt-6"
          >
            Отправить
          </v-btn>
        </v-form>
  
        <div 
          @click="router.push('/login')" 
          class="text-subtitle-1 w-100 cursor-pointer font-weight-semibold pa-1 mt-2"
        >
          вход
        </div>
      </v-card>
    </v-col>
  </v-container>
  </div>
</template>

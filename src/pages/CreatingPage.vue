<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import { useAuth } from '../stores/auth';
import { useField, useForm } from 'vee-validate'
import { User } from '../types/user.interface';
import { storeToRefs } from 'pinia';

let user = storeToRefs(useAuth()).user as Ref<User>
let router = useRouter()

let loading = ref(false)

const { meta, handleSubmit, validate } = useForm({
  initialValues: {
    title: '',
    description: '',
    price: '',
    location: {
      name: '',
      geo_lat: null,
      geo_lot: null
    }
  },
  validationSchema: {
    title(value: string) {
      if (value.trim().length < 4) return 'слишком короткий заголовок'
      if (value.length > 32) return 'слишком длинный заголовок'
      
      return true
    },
    description(value: string) {
      if (value.trim().length < 20) return 'слишком короткое описание' 
      if (value.length > 150) return 'слишком длинное описание'
      
      return true
    },
    price(value: string) {
      return value ? true : 'введите цену'
    }
  },
})

let title = useField<string>('title')
let description = useField<string>('description')
let price = useField<string>('price')
let location = useField<string>('location')

const submit = handleSubmit(async values => {
  loading.value = true

  // await EntryAPI.create(Object.assign(values, {
  //   type: variant.value,
  //   school: user.value.school._id,
  // }))
  // .then(() => router.push(`/user/${user.value._id}`))
  
  loading.value = false
})
</script>

<template>
  <div class="w-100">
  <v-container class="mt-1">
    <BackButton />

    <v-row class="justify-center">
      <v-col cols="12" md="6" lg="4">
        <v-form @submit.prevent="submit" class="global-box d-flex flex-column align-center w-100 h-100 pt-4 pr-6 pb-4 pl-6">
          <div class="font-weight-bold" style="font-size: 20px;">Создать</div>
  
          <v-text-field 
            v-model="title.value.value"
            :error-messages="title.errorMessage.value"
            placeholder="Заголовок"
            variant="outlined"
            density="compact"
            class="mt-3 w-100"
          />
      
          <v-textarea
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
            variant="outlined"
            placeholder="Описание"    
            density="compact"
            class="w-100"
          />
      
          <v-text-field 
            v-model="price.value.value"
            :error-messages="price.errorMessage.value"
            variant="outlined"
            placeholder="Цена"
            density="compact"
            class="w-100"
          />
  
          <!-- <v-text-field 
            v-model="form.location" 
            variant="outlined"
            placeholder="Адрес"
            density="compact"
            class="w-100"
          /> -->
  
          <v-btn variant="tonal" class="w-100 text-body-1">
            Загрузить фото
          </v-btn>
  
          <div class="mt-4 w-100 d-flex">
            <v-btn class="text-body-1" variant="tonal" prepend-icon="mdi-plus">
              Телефон
            </v-btn>
          </div>
              
          <v-btn 
            class="ma-auto bg-green-lighten-1 mt-4"
            variant="tonal"
            type="submit"
            :loading="loading"
            :disabled="!meta.valid" 
          >
            Отправить
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<style lang="scss">

</style>
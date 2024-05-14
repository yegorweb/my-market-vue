<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import Cropper from '../components/Cropper.vue';
import { useAuth } from '../stores/auth';
import { useProduct } from '../stores/product'
import { useField, useForm } from 'vee-validate'
import { User } from '../types/user.interface';
import { storeToRefs } from 'pinia';
import { CropResult } from "../types/cropresult.interface";

let user = storeToRefs(useAuth()).user as Ref<User>
let router = useRouter()
const productStore = useProduct()

let loading = ref(false)
const { meta, handleSubmit, validate } = useForm({
  initialValues: {
    title: '',
    description: '',
    price: '',
    images: <Array<File>>[],
    phone: '',
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
    },
    phone(value: string) {
      return value ? true : 'введите телефон'
    }
  },
})

let possibleLocations = ref([])

let title = useField<string>('title')
let description = useField<string>('description')
let price = useField<string>('price')
let location = ref<any>()
let phone = useField<string>('phone')
let images = useField<Array<Blob | null>>('images')
let previews = ref<Array<String>>([])
let locationSearchRequest = ref<string>('')

async function getPossibleLocations(value: string) {
  if (value.trim().length < 3)
    return

  let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

  let options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Token ${import.meta.env.VITE_DADATA_TOKEN}`
    },
    body: JSON.stringify({
      query: value,
      count: 10,
      "from_bound": { "value": "city" },
      "to_bound": { "value": "house" }
    })
  }

  let res = await fetch(url, options as any)

  try {
    let suggestions = JSON.parse(await res.text()).suggestions
    //         city_with_type : "г Глазов"
    //         region_with_type: "Удмуртская Респ"
    return suggestions.map(s => ({
      name: s.value,

      // dont remove name duplication 
      geo: {
        name: s.value,
        geo_lat: s.data.geo_lat,
        geo_lon: s.data.geo_lon,
        city_with_type: s.data.city_with_type,
        settlement_with_type: s.data.settlement_with_type,
        region_with_type: s.data.region_with_type,
        area_with_type: s.data.area_with_type,
        capital_marker: s.data.capital_marker
      }

    }))
  } catch (error) {
    console.log(error);
  }
}
function handleCrop(result: CropResult) {
  images.value.value.push(result.file)
  previews.value.push(result.base64)
}

const submit = handleSubmit(async (values: any) => {
  loading.value = true
  console.log(location.value.name);

  values.location = { type: 'Point', coordinates: [location.value.geo_lon, location.value.geo_lat] }
  values.address = location.value.name
  const response = await productStore.create(values)
  const productId = response?.data._id

  if (productId) {
    let formData = new FormData()
    for (let i = 0; i < values.images.length; i++) {
      formData.append(`${productId}_${i}`, values.images[i])
    }
    await productStore.uploadImages(formData, productId)
  }
  loading.value = false
  router.push('/')
})
watch(locationSearchRequest, async (value) => {
  possibleLocations.value = await getPossibleLocations(value);
});
</script>

<template>
  <div class="w-100">
    <v-container class="mt-1">
      <BackButton />

      <v-row class="justify-center">
        <v-col cols="12" md="6" lg="4">
          <v-form @submit.prevent="submit"
            class="global-box d-flex flex-column align-center w-100 h-100 pt-4 pr-6 pb-4 pl-6">
            <div class="font-weight-bold" style="font-size: 20px;">Создать</div>

            <v-text-field v-model="title.value.value" :error-messages="title.errorMessage.value" placeholder="Заголовок"
              variant="outlined" density="compact" class="mt-3 w-100" />

            <v-textarea v-model="description.value.value" :error-messages="description.errorMessage.value"
              variant="outlined" placeholder="Описание" density="compact" class="w-100" />

            <v-text-field v-model="price.value.value" :error-messages="price.errorMessage.value" variant="outlined"
              placeholder="Цена" density="compact" class="w-100" />

            <!-- <v-text-field 
            v-model="form.location" 
            variant="outlined"
            placeholder="Адрес"
            density="compact"
            class="w-100"
          /> -->
            <v-autocomplete hide-details density="compact" v-model="location" v-model:search="locationSearchRequest"
              :items="possibleLocations" item-title="name" placeholder="Место" item-value="geo" variant="outlined"
              clearable class="w-100 mb-4">
              <template v-slot:no-data>
                <div class="pt-2 pr-4 pb-2 pl-4">
                  {{
                    locationSearchRequest.trim().length < 3 ? "Минимум 3 символа" : "Не найдено" }} </div>
              </template>
            </v-autocomplete>

            <v-text-field v-model="phone.value.value" :error-messages="phone.errorMessage.value" variant="outlined"
              placeholder="Телефон" density="compact" class="w-100" />

            <Cropper @finishCrop="handleCrop"></Cropper>
            <v-row class="d-flex justify-center">
              <v-col cols="auto">
                <div v-for="p in previews" class="preview">
                  <img :src="p.toString()" alt="preview" />
                </div>
              </v-col>
            </v-row>

            <v-btn class="ma-auto bg-green-lighten-1 mt-4" variant="tonal" type="submit" :loading="loading"
              :disabled="!meta.valid">
              Отправить
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.preview {
  img {
    height: 150px;
  }
}
</style>

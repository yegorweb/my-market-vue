<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useScroll } from '@vueuse/core'
import { computed, ref, watch } from 'vue';
import { useProduct } from '../stores/product';

let router = useRouter()
const { x, y } = useScroll(document)
let showAddPlace = ref(false)

let locationQuery = ref('')
let possibleLocations = ref<any>([])

let { location, filter, radius } = storeToRefs(useProduct())
watch([radius, location], ([rad, loc]) => {
  if (!loc || !rad) return
  localStorage.setItem('radius', rad as string)
  filter.value = { radius: rad, geo_lon: loc.geo_lon, geo_lat: loc.geo_lat } 
  useProduct().get()
}, { deep: true })

watch(locationQuery, async (value, oldValue) => {
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
    possibleLocations.value = suggestions.map(s => ({
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
})
</script>

<template>
  <div :style="`background: ${ y > 0 ? '#FFFFFF' : 'none'}; position: fixed; top: 0; left: 0; right: 0; height: 60px; z-index: 999;`">
    <v-container class="d-flex align-center justify-space-between user-select-none" style="height: 60px; position: relative;">
      <div @click="router.push('/')" class="d-flex align-center cursor-pointer logo">
          <img src="/logo.svg" style="height: 40px;" class="logo-img" />
  
          <div class="font-weight-bold" style="font-size: 18px; margin-left: 15px;">МойМаркет</div>
      </div>
  
      <v-menu :close-on-content-click="false" location="bottom center" scroll-strategy="close" transition="scroll-y-transition">
        <template v-slot:activator="{ props }">
            <div v-bind="props" :class="`d-flex align-center pa-2 cursor-pointer ${useDisplay().smAndUp.value ? 'abs-location' : ''}`">
              <span class="mdi mdi-map-marker-outline" style="font-size: 20px;" />&nbsp;{{ location ? location.name.split(' ').pop() : 'Укажите' }}
            </div>
        </template>

        <v-card class="mt-2 pa-6 rounded-lg" :style="{ width: useDisplay().smAndUp.value ? '450px' : '350px' }">
          <v-autocomplete 
            hide-details 
            density="compact" 
            v-model="location" 
            v-model:search="locationQuery"
            auto-select-first
            :items="possibleLocations" 
            item-title="name" 
            placeholder="Место" 
            item-value="geo" 
            variant="outlined"
            clearable 
            class="w-100 mb-4"
          >
            <template v-slot:no-data>
              <div class="pt-2 pr-4 pb-2 pl-4">
                {{ locationQuery.trim().length < 3 ? "Минимум 3 символа" : "Не найдено" }} 
              </div>
            </template>
          </v-autocomplete>

          <v-text-field
            v-model="radius"
            variant="outlined"
            label="Радиус"
            density="compact"
            hide-details
          ></v-text-field>
        </v-card>
      </v-menu>
      
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

          <v-list-item prepend-icon="mdi-account" :ripple="false" to="/my-page">
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
.logo-img {
  border-radius: 12px;
  transition: all .25s;
}
.logo:hover {
  .logo-img {
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.07);
  }
}
</style>

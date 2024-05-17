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
  localStorage.setItem('radius', rad as string)
  filter.value = { radius: rad, geo_lon: loc.coordinates[0], geo_lat: loc.coordinates[1] } 
  useProduct().get()
}, { deep: true })

watch(locationQuery, async (value, oldValue) => {
  if (value.trim().length > 2 && value.length > oldValue.length) {
    let options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
      },
      body: JSON.stringify({
        query: value,
        count: 5,
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    }
    
    let res = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", options as any)
    try {
      let suggestions = JSON.parse(await res.text()).suggestions
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          name: s.value,
          shortName: '',
          type: 'Point',
          coordinates: [
            s.data.geo_lon,
            s.data.geo_lat
          ]
        }

        if (s.data.settlement) {
          location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.shortName = s.data.city
        } else {
          location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})

watch(possibleLocations, value => console.log(value))
</script>

<template>
  <div :style="`background: ${ y > 0 ? '#FFFFFF' : 'none'}; position: fixed; top: 0; left: 0; right: 0; height: 60px; z-index: 999;`">
    <v-container class="d-flex align-center justify-space-between user-select-none" style="height: 60px; position: relative;">
      <div @click="router.push('/')" class="d-flex align-center cursor-pointer logo">
          <img src="/logo.svg" style="height: 40px;" class="logo-img" />
  
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

          <v-list-item prepend-icon="mdi-account" :ripple="false" to="/my-page">
            Кабинет
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>

    <v-menu v-model="showAddPlace" :close-on-content-click="false" activator="parent" scroll-strategy="close" transition="scroll-y-transition">
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="6" lg="4" class="pa-0">
          <v-card class="pa-6 rounded-lg">
            <v-autocomplete 
              v-model="location" 
              v-model:search="locationQuery" 
              :items="possibleLocations" 
              item-title="name" 
              label="Место" 
              density="compact"
              variant="outlined"
              clearable 
            />

            <v-text-field
              v-model="radius"
              variant="outlined"
              placeholder="Радиус"
              density="compact"
              hide-details
            ></v-text-field>
          </v-card>
        </v-col>
      </v-row>
    </v-menu>
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

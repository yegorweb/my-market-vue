<script setup lang="ts">
import { useShare } from '@vueuse/core';
import BackButton from '../components/BackButton.vue';
import { useProduct } from '../stores/product';
import { Product } from '../types/product.interface';

let props = defineProps(['id'])
let id = props.id
let product = await useProduct().getById(id) as Product

const { share, isSupported } = useShare()

function startShare() {
  share({
    title: product.title,
    text: product.address,
    url: location.href,
  })
}
</script>

<template>
  <div class="w-100">
  <v-container>
    <BackButton />

    <v-row class="mt-1">
      <v-col cols="12" md="4">
        <v-carousel height="auto" hide-delimiters style="border-radius: 8px">
          <v-carousel-item
            v-for="src, i in product.images"
            :key="i"
            height="auto"
            :src="src"
          ></v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="12" md="8" style="min-height: 100%">
        <div class="info pa-6">
          <v-row>
            <v-col cols="12" lg="8">
              <div 
                class="font-weight-bold mr-7" 
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 100%; font-size: 20px;"
              >
                {{ product.title }}
              </div>
    
              <div class="mt-1">
                {{ product.description }}
              </div>
              
              <div 
                style="font-weight: 600;" 
                class="mt-2"
              >
                {{ product.price }}
              </div>
    
              <div class="mt-1">
                <span class="mdi mdi-map-marker-outline" style="font-size: 18px;"></span> {{ product.address }}
              </div>
            </v-col>

            <v-col class="d-flex flex-column align-start align-lg-end" cols="8" lg="4">
              <v-btn :ripple="false" prepend-icon="mdi-phone" class="bg-green w-100 rounded-lg text-body-1" variant="tonal" :href="`tel:${product.phone}`">
                Позвонить
              </v-btn>

              <v-btn :ripple="false" prepend-icon="mdi-send" class="mt-2 w-100 rounded-lg text-body-1" variant="tonal" :href="`whatsapp://send?phone=${product.phone}`">
                Написать
              </v-btn>

              <v-btn @click="startShare" v-if="isSupported" :ripple="false" prepend-icon="mdi-share" class="mt-2 w-100 text-body-1" variant="text">
                Поделиться
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<style lang="scss" scoped>
.info {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 10px 40px 5px rgba(34, 60, 80, 0.08);
}
</style>

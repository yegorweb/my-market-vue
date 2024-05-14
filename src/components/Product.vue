<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { Product } from '../types/product.interface';

let props = defineProps<{ product: Product }>()

let product = props.product
let router = useRouter()
let like = ref(false)
</script>

<template>
  <div class="container" @click="router.push(`/product/${product._id}`)">
    <div :style="{ background: `url(${product.images[0]}) 50% 50% no-repeat`, backgroundSize: 'cover', aspectRatio: `1.3`, width: `100%` }" />
  
    <div class="pa-4 pt-4" style="position: relative;">
      <div 
        class="font-weight-bold mr-7" 
        style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 100%; font-size: clamp(1rem, 0.8438rem + 0.5vw, 1.125rem);"
      >
        {{ product.title }}
      </div>

      <!-- <v-icon
        @click="like = !like"
        style="position: absolute; padding: 4px; top: 12px; right: 14px;"
        :icon="like ? 'mdi-heart' : 'mdi-heart-outline'" 
        :color="like ? 'red' : 'black'"
        variant="text"
        :ripple="false"
      /> -->

      <div 
        class="mt-1" 
        style="line-height: 1.1; font-size: clamp(0.9375rem, 0.8594rem + 0.25vw, 1rem);"
      >
        {{ product.description.slice(0, 40) }}...
      </div>
      
      <div 
        style="font-weight: 600; font-size: clamp(0.9375rem, 0.8594rem + 0.25vw, 1rem);" 
        class="mt-2"
      >
        {{ product.price }}
      </div>

      <div class="mt-1" style="font-size: clamp(0.875rem, 0.7188rem + 0.5vw, 1rem);">
        <span class="mdi mdi-map-marker-outline" style="font-size: 18px;"></span> {{ product.address }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 10px 40px 5px rgba(34, 60, 80, 0.08);
  transition: .2s;

  &:hover {
    box-shadow: 0px 10px 50px 10px rgba(34, 60, 80, 0.14);
  }
}
</style>

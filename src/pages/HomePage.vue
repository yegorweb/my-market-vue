<script setup lang="ts">
import { storeToRefs } from "pinia";
import Product from "../components/Product.vue";
import { useProduct } from "../stores/product";
 
document.title = 'Мой Маркет'

let { products, loading } = storeToRefs(useProduct())
useProduct().get()
</script>

<template>
  <div class="w-100">
    <v-container>
      <v-row v-if="products.length && !loading">
        <v-col v-for="item in products" cols="6" sm="4" md="3">
          <Product :product="item" />
        </v-col>
      </v-row>

      <v-progress-linear
        v-if="loading"
        color="green"
        indeterminate
      ></v-progress-linear>

      <div v-if="!products.length && !loading">
        Не найдено
      </div>
    </v-container>
  </div>
</template>

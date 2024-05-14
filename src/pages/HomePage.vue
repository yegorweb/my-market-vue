<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router"
import { useAuth } from '../stores/auth'
import Product from "../components/Product.vue";
import { useProduct } from "../stores/product";
 
document.title = 'Мой Маркет'

let router = useRouter()

let auth = useAuth()
let { user } = storeToRefs(auth)
let { products } = storeToRefs(useProduct())
useProduct().get()
</script>

<template>
  <div class="w-100">
    <v-container>
      <v-row>
        <v-col v-for="item in products" cols="6" sm="4" md="3">
          <Product :product="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

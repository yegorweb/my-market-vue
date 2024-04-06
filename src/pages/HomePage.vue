<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router"
import { useAuth } from '../stores/auth'
import Product from "../components/Product.vue";
 
document.title = 'Мой Маркет'

let router = useRouter()

let auth = useAuth()
let { user } = storeToRefs(auth)

</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="item in 10" cols="6" sm="4" md="3">
        <Product />
      </v-col>
    </v-row>
  </v-container>
</template>

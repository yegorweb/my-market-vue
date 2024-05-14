import { defineStore } from "pinia";
import ProductAPI from "../api/ProductAPI";
import { Product } from "../types/product.interface";
import { ref } from "vue";

export const useProduct = defineStore('product', () => {
  let products = ref([])
  let filter = ref()

  async function create(data: any) {
    try {
      const response = await ProductAPI.create(data)
      return response
    } catch (error) { console.log(error); }
  }
  async function uploadImages(formData: any, productId: String): Promise<void> {
    try {
      const response = await ProductAPI.uploadImages(formData, productId)
      console.log(response);
    } catch (error) { console.log(error); }
  }

  async function get(): Promise<Product[]> {
    try {
      return (await ProductAPI.get(filter.value)).data
    } catch {
      return []
    }
  }

  async function getById(_id: string): Promise<Product | undefined> {
    try {
      return (await ProductAPI.getById(_id)).data
    } catch { }
  }

  async function getByAuthor(_id: string): Promise<Product[]> {
    try {
      return (await ProductAPI.getByAuthor(_id)).data
    } catch {
      return []
    }
  }

  async function getMyProducts(): Promise<Product[]> {
    try {
      return (await ProductAPI.getMyProducts()).data
    } catch {
      return []
    }
  }

  async function deleteProduct(product_id: string): Promise<void> {
    try {
      await ProductAPI.delete(product_id)
    } catch { }
  }

  return { products, filter, get, getById, getByAuthor, getMyProducts, create, deleteProduct, uploadImages }
})

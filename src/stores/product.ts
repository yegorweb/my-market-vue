import { defineStore } from "pinia"
import ProductAPI from '../api/ProductAPI'

export const useProduct = defineStore('product', () => {
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
        } catch (error) {  console.log(error); }
    }
    return { create, uploadImages }
})
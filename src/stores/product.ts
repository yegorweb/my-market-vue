import { defineStore } from "pinia"
import ProductAPI from '../api/ProductAPI'

export const useProduct = defineStore('product', () => {
    async function create(data: any): Promise<void> {
        try {
            const response = await ProductAPI.create(data)
            console.log(response);
        } catch (error) { console.log(error); }
    }
    return { create }
})
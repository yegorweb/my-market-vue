import { defineStore } from "pinia";
import ProductAPI from "../api/ProductAPI";
import { Product } from "../types/product.interface";

export const useProduct = defineStore('product', () => {
  async function get(query: object): Promise<Product[]> {
    try {
      return (await ProductAPI.get(query)).data
    } catch {
      return []
    }
  }

  async function getById(_id: string): Promise<Product | undefined> {
    try {
      return (await ProductAPI.getById(_id)).data
    } catch {}
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

  async function create(product: any): Promise<void> {
    try {
      await ProductAPI.create(product)
    } catch {}
  }

  async function deleteProduct(product_id: string): Promise<void> {
    try {
      await ProductAPI.delete(product_id)
    } catch {}
  }

  return { get, getById, getByAuthor, getMyProducts, create, deleteProduct }
})

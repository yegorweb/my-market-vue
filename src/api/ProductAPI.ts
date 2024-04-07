import $api from "../plugins/axios"

export default {
  get(query: object) {
    return $api.get('/product/get', { params: query })
  },
  getById(_id: string) {
    return $api.get('/product/get-by-id', { params: { _id } })
  },
  getByAuthor(_id: string) {
    return $api.get('/product/get-by-author', { params: { _id } })
  },
  getMyProducts() {
    return $api.get('/product/get-my-products')
  },
  create(product: any) {
    return $api.post('/product/create', product)
  },
  delete(product_id: string) {
    return $api.delete('/product/delete', { params: { product_id } })
  }
}
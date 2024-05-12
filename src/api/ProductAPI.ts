import $api from '../plugins/axios'

export default {
    create(product: any) {
        // Егор, ради тебя делаю не на /product, а на /product/create
        return $api.post('/product/create', { product })
    },
    uploadImages(formData: any, productId: String) {
        return $api.post(`/product/upload-images?_id=${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
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
    delete(product_id: string) {
        return $api.delete('/product/delete', { params: { product_id } })
    }
}
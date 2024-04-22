import $api from '../plugins/axios'

export default {
    async create(product: any) {
        // Егор, ради тебя делаю не на /product, а на /product/create
        return $api.post('/product/create')
    }
}
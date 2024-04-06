import $api from '../plugins/axios'

export default {
  getById(_id: string) {
    return $api.get('/user/get-by-id', { params: { _id } })
  },
}
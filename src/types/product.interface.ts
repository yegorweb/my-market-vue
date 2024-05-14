import { User } from "./user.interface"

export interface Product {
  _id: string
  title: string
  description: string
  author: User
  responses: string[]
  address: string,
  images: string[],
  price: string,
  location: {
    type: 'Point'
    coordinates: [number, number]
  },
  phone: string
}

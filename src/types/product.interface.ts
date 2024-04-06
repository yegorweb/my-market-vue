import { User } from "./user.interface"

export interface Product {
  _id: string
  title: string
  description: string
  author: User
  responses: string[]
  date: number
  on_moderation: boolean
  moderation_result?: boolean
}
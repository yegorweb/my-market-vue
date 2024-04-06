import { defineStore } from "pinia";
import UserAPI from "../api/UserAPI";
import { User } from "../types/user.interface";

export const useUser = defineStore('user', () => {
  async function getById(_id: string): Promise<User | undefined> {
    try {
      return (await UserAPI.getById(_id)).data
    } catch {}
  }

  return { getById }
})

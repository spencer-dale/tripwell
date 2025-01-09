'use server'

import { User } from "../types";
import { connectDb } from "./conn";
import { users } from "./models";

export async function createUser(user: User) {
    await connectDb()
    await users.create(user)
}

export async function getUserById(user_id: string) : Promise<User> {
  await connectDb()
  return await users.findOne({user_id: user_id})
}
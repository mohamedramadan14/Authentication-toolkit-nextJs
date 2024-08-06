"use server"

import { signOut } from "@/auth"
import { cookies } from 'next/headers'

export const logout = async () => {
    await signOut({
        redirectTo: "/auth/login",
    })
}
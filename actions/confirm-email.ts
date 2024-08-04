"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/utils/data/user"
import { getVerificationTokenByToken } from "@/utils/data/verification-token"

export const confirmEmail = async (token: string) => {
    const verificationToken = await getVerificationTokenByToken(token);
    if(!verificationToken){
        return {
            error: true,
            message: "Invalid token"
        }
    }
    const hasExpired = verificationToken.expires.getTime() < new Date().getTime();    

    if(hasExpired){
        return {
            error: true,
            message: "Token expired"
        }
    }

    const user = await getUserByEmail(verificationToken.email);
    if(!user){
        return {
            error: true,
            message: "Email not found."
        }
    }

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            emailVerified: new Date(),
            email: verificationToken.email
        }
    })

    await db.verificationToken.delete({
        where: {
            id: verificationToken.id
        }
    })

    return {success: true , message: "Email verified successfully"}
}


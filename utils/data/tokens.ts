import { db } from "@/lib/db";
import {v4 as uuidV4 } from "uuid";
import { getVerificationTokenByEmail } from "@/utils/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/utils/data/password-reset-token";
 
export const generatePasswordResetToken = async (email: string) => {
    const token = uuidV4();
    const expires = new Date(new Date().getTime() + 3600000);
    const existingToken = await getPasswordResetTokenByEmail(email);
    
    if(existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const newPasswordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            expires,
            token
        }
    })

    return newPasswordResetToken;
}
export const generateVerificationToken =  async (email: string) => {
    const token = uuidV4();
    const expires = new Date(new Date().getTime() + 3600000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const newVerificationToken = await db.verificationToken.create({
        data: {
            email,
            expires,
            token
        }
    })

    return newVerificationToken;
}
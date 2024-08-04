import { db } from "@/lib/db";
import {v4 as uuidV4 } from "uuid";
import { getVerificationTokenByEmail } from "./verification-token";

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
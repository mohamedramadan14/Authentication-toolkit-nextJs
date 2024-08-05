"use server"

import { sendPasswordResetEmail } from "@/lib/mail"
import { resetSchema } from "@/schemas"
import { generatePasswordResetToken } from "@/utils/data/tokens"
import { getUserByEmail } from "@/utils/data/user"
import * as z from "zod"

export const resetPassword = async (values: z.infer<typeof resetSchema>) => {
    const validatedFields = resetSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            error : true,
            message : "Invalid Email!"
        }
    }

    const {email} = validatedFields.data

    const user = await getUserByEmail(email)

    if(!user){
        return {
            error : true,
            message : "Email not found"
        }
    }
    
    // TODO: error handling for sending email and generate the token
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)
    return {
        success: true,
        message: "Reset email sent successfully"
    }
}
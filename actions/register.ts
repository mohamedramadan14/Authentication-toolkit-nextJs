"use server"

import { registerSchema } from "@/schemas";
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/data/user";
import { generateVerificationToken } from "@/utils/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof registerSchema>) =>{
    const validatedFields = registerSchema.safeParse(values);
    
   /*  return {error : true , message: "Invalid fields!"} */
    if(!validatedFields.success){
        return {error : validatedFields.error , message: "Invalid fields!"}
    }

    const {email , name , password} = validatedFields.data

    const existingUser = await getUserByEmail(email)
    
    if(existingUser){
        return {
            error: true,
            message: "User already existed"
        }
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    await db.user.create({
        data:{
            name,
            email,
            password: hashedPassword
        }
    })

    // TODO: send verification email
    const verificationToken = await generateVerificationToken(email)
    
    await sendVerificationEmail(verificationToken.email , verificationToken.token)

    return {message : "Confirmation Email sent!" , success: true}
}
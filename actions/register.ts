"use server"

import { registerSchema } from "@/schemas";
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/data/user";

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

    return {message : "User created!" , success: true}
}
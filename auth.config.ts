import bcrypt  from 'bcryptjs';
/* import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google" */
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/schemas"

import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "@/utils/data/user";
 
export default { providers: [Credentials({
    // @ts-ignore
    async authorize(credentials , _req){
        const validatedFields = loginSchema.safeParse(credentials);
        if(validatedFields.success){
            const {email , password} = validatedFields.data;
            const user = await getUserByEmail(email);
            if(!user || !user.password) return null;
            const isPasswordMatch = await bcrypt.compare(password , user.password);
            if(isPasswordMatch) return user;
            return null;
        }
    }
})] } satisfies NextAuthConfig
"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const Social = () => {
    const onClickHandler = (provider: "google" | "github") => {
        signIn(provider , {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }   
    return (
        <div className="flex items-center w-full gap-x-3">
            <Button className="w-full" variant="outline" size="lg" onClick={() => onClickHandler("google")}><FcGoogle className="w-5 h-5"/></Button>
            <Button className="w-full" variant="outline" size="lg" onClick={() => onClickHandler("github")}><FaGithub className="w-5 h-5"/></Button>
        </div>
    )
}
"use client"

import { useRouter } from "next/navigation"
interface LoginButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect"
    asChild?: boolean
}

type Router = ReturnType<typeof useRouter>

const onClickHandler = (router: Router) =>{
    router.push("/auth/login")
}
export const LoginButton = ({children, mode = "redirect", asChild = false}: LoginButtonProps) => {
    const router = useRouter()
    if (mode === "modal") {
        return <span>
            TODO: Implement modal
        </span>
    }
    return <span onClick={() => onClickHandler(router)} className="cursor-pointer">{children}</span>
} 
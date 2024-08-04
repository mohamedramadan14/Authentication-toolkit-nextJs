import {Button} from "@/components/ui/button"
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/LoginButton";

const font = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})
export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-r from-slate-500 to-slate-800">
      <div className="space-y-6">
        <h1 className={cn("text-4xl font-semibold text-white drop-shadow-md" , font.className)}>👾 AUTH</h1>
        <p className="text-white text-lg text-center">Simple Authentication toolkit</p>
        <div>
          <LoginButton >
              <Button variant="secondary" size="lg">Sign In</Button>
          </LoginButton>
        </div>
      </div>
    </main>
    
  );
}

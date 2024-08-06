"use client";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
//import { auth, signOut } from "@/auth"
import { useSession, signOut } from "next-auth/react";

export default function Settings() {
  const user = useCurrentUser();

  const onClickHandler = (e: any) => {
    e.preventDefault();
    logout();
  };
  
  return (
    <div className="bg-white rounded-xl p-10">
        <button onClick={onClickHandler}>
          SignOut
        </button>
    </div>
  );
}

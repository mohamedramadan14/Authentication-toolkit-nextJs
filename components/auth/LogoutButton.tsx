"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <span onClick={(e) => onClickHandler(e)} className="cursor-pointer">
      {children}
    </span>
  );
};

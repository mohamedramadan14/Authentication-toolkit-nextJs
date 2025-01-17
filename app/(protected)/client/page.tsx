"use client";

import { UserInfo } from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage =  () => {
  const user =  useCurrentUser();

  return <UserInfo user={user} label="Client" />;
};

export default ClientPage;

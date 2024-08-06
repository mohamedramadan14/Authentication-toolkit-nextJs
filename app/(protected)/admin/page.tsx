"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/RoleGate";
import { FormSuccess } from "@/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";


const AdminPage = () => {
  const onServerActionClick = () => {
    admin()
      .then((res) => {
        if(res.error) {
          toast.error(res.error)
        }else{
          toast.success(res.success)
        }
      })
  }
    const onAPIRouteClick = () => {
        fetch("/api/admin")
            .then((res) => {
                if(res.ok) {
                  toast.success("Allowed")
                }else{
                  toast.error("Not Allowed")
                }
                res.json().then((data) => {
                    console.log(data.message)
                })
            })
            
    }
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to access this page." />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin Only API Routes</p>
          <Button onClick={onAPIRouteClick}>Click to Test</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin Only Server Action</p>
          <Button onClick={onServerActionClick}>Click to Test</Button>
        </div>
 
      </CardContent>
    </Card>
  );
};

export default AdminPage;

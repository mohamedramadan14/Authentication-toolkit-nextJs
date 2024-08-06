import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const role = await currentRole();
    if(role === UserRole.ADMIN) return new NextResponse(JSON.stringify({message: "OK"}), {status: 200})
    return new NextResponse(JSON.stringify({message: "FORBIDDEN"}) , {status: 403})
}
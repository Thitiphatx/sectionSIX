"use server"

import prisma from "@/libs/prisma";
import { editUserSchema } from "@/libs/zod/editUser";
import { UserRole, UserStatus } from "@prisma/client";

type editProp = {
    adminId: string,
    id: string,
    name: string,
    email: string,
    role: UserRole,
    status: UserStatus
}


export default async function editUser({ adminId, id, name, email, role, status }: editProp) {
    
    // 1. Validate info
    const validationResult = editUserSchema.safeParse({ id, name, email, role, status });
    if (!validationResult.success) {
        return {
            message: "Invalid information"
        }
    }

    // 2. Check editor access
    const admin = await prisma.users.findFirst({
        where: { id: adminId }
    })

    if (!admin || admin.role !== "ADMIN") {
        return {
            message: "No access to edit user"
        }
    }

    // 3. Update
    try {
        await prisma.users.update({
            where: { id: id },
            data: {
                email: email,
                name: name,
                role: role,
                status: status,
            }
        })

    } catch (error) {
        return {
            message: "error"
        }
    }
}
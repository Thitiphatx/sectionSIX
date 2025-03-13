"use server"

import prisma from "@/libs/prisma"
import { passwordSchema, profileSchema } from "@/libs/zod/zod";
import { compare, hashSync } from "bcryptjs"

interface saveInfoProp {
    email: string;
    name: string;
    id: string;
}

interface passwordProp {
    id: string;
    currentPassword: string;
    password: string;
    confirmPassword: string;
}

export async function handleSaveInfo({ id, name, email }: saveInfoProp) {
    const validationResult = profileSchema.safeParse({ id, name, email });

    if (!validationResult.success) {
        return {
            message: "Invalid information"
        }
    }

    try {
        await prisma.users.update({
            where: { id: id },
            data: {
                email: email,
                name: name
            }
        })

    } catch (error) {
        return {
            message: "error"
        }
    }
}

export async function handleSavePassword({ id, currentPassword, password, confirmPassword }: passwordProp) {
    const validationResult = passwordSchema.safeParse({ id, currentPassword, password, confirmPassword });

    if (!validationResult.success) {
        return {
            message: "Invalid information"
        };
    }

    try {
        const user = await prisma.users.findFirst({
            where: { id: id }
        });

        if (!user) {
            return {
                message: "Something went wrong. Please re-login."
            };
        }

        // Check if current password matches the user's stored password
        const matched = await compare(currentPassword, user.password);
        if (!matched) {
            return {
                message: "Current password is incorrect"
            };
        }

        // Hash the new password before storing it
        const hashedPassword = await hashSync(password, 10);

        await prisma.users.update({
            where: { id: id },
            data: { password: hashedPassword }
        });

        return {
            message: "Password updated successfully"
        };
    } catch (error) {
        console.error("Error updating password:", error);
        return {
            message: "Failed to update password"
        };
    }
}
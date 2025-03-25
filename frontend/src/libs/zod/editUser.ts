import { UserRole, UserStatus } from "@prisma/client";
import { object, string, z } from "zod";


export const editUserSchema = object({
    id: string(),
    name: string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .min(4, "Name must be more than 4 characters")
        .max(24, "Name must be less than 24 characters"),
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    status: z.nativeEnum(UserStatus, {
        errorMap: (issue, ctx) => {
            return { message: "Invalid status selected. Must be ACTIVE or DEACTIVE." }
        }
    }),
    role: z.nativeEnum(UserRole, {
        errorMap: (issue, ctx) => {
            return { message: "Invalid role selected. Must be Admin or User." }
        }
    }),

})
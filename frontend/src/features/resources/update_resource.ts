"use server"

import prisma from "@/libs/prisma";
import { resourceSchema } from "@/libs/zod/resource"

export async function update_resource({ id, name }: { id:string, name: string }) {
    console.log(id, name)
    try {
        const validationResult = resourceSchema.safeParse( { id, name });
        if (!validationResult.success) {
            return {
                message: "Invalid info"
            }
        }

        await prisma.resources.update({
            where: { id },
            data: { name }
        })
    } catch (error) {
        
    }
}
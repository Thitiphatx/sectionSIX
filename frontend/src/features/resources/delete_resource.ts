"use server"

import prisma from "@/libs/prisma"

export async function DeleteResource(id: string) {
    console.log(id);
    try {
        await prisma.resources.delete({
            where: { id }
        })
    } catch (error) {
        console.log(error);
    }
}
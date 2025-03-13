"use server"

import prisma from "@/libs/prisma"

export async function DeleteResource(id: string) {
    try {

        // 1. delete image file call api python

        // 2. delete resource data from database
        await prisma.resources.delete({
            where: { id }
        })
    } catch (error) {
        console.log(error);
    }
}
"use server"

import prisma from "@/libs/prisma"

export const resource_status_validation = async (resourceId: string)=> {
    try {
        const result = await prisma.resources.findFirst({
            where: { id: resourceId },
            include: { Images: true }
        });

        const allImagesAvailable = result?.Images.every(image => image.status === "AVAILABLE");
        if (allImagesAvailable) {
            await prisma.resources.update({
                where: { id: resourceId },
                data: {
                    status: "READY"
                }
            })
        }

    } catch (error) {
        throw new Error("Database is offline")
    }
}
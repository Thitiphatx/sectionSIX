"use server"
import prisma from "@/libs/prisma";

export async function getVersionPrice(versionId: string) {
    const data = await prisma.clusterVersions.findFirst({
        where: {
            id: versionId
        },
        select: {
            price: true
        }
    })
    return data?.price
}
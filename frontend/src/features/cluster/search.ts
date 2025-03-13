"use server";

import prisma from "@/libs/prisma";

export async function getClusters(query: string) {
    return await prisma.clusters.findMany({
        where: {
            address: {
                contains: query,   // Partial match
                mode: "insensitive", // Case insensitive
            },
        },
    });
}

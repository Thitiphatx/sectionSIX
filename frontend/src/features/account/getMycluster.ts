"use server"
import prisma from "@/libs/prisma";

export async function getMyCluster(query: string, userId: string) {
    return await prisma.clusters.findMany({
        where: {
            address: {
                contains: query,   // Partial match
                mode: "insensitive", // Case insensitive
            },
            ClusterVersions: {
                some: {
                    Transaction: {
                        some: {
                            user_id: userId,
                            status: "SUCCESS" // Ensuring the transaction was successful
                        }
                    }
                }
            }
        },
        include: {
            ClusterVersions: {
                where: {
                    status: "ACTIVE",
                    Transaction: {
                        some: {
                            user_id: userId,
                            status: "SUCCESS"
                        }
                    }
                },
                select: {
                    id: true,
                }
            }
        }
    });
}
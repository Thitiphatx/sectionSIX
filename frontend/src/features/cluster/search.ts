"use server";

import prisma from "@/libs/prisma";

export async function getClusters(query: string, isAdmin: boolean) {
    return await prisma.clusters.findMany({
        where: {
            address: {
                contains: query,   // Partial match
                mode: "insensitive", // Case insensitive
            },
            ...(isAdmin
                ? {} // If admin, do not filter ClusterVersions
                : {
                      ClusterVersions: {
                          some: {
                              status: {
                                  not: "UNPROCESS"
                              }
                          }
                      }
                  })
        },
        include: {
            ClusterVersions: {
                ...(isAdmin
                    ? {} // If admin, include all versions
                    : {
                          where: {
                              status: "ACTIVE"
                          }
                      }),
                select: {
                    id: true,
                }
            }
        }
    });
}

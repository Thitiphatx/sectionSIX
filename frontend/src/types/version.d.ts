import prisma from "@prisma/client"

export type VersionWithAddress = Prisma.ClusterVersionsGetPayload<{
    include: {
        Clusters: {
            select: {
                address: true
            }
        }
    };
}>;
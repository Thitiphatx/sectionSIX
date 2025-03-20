import { Clusters } from "@prisma/client";

export type BrowseItem = Prisma.ClustersGetPayload<{
    include: {
        ClusterVersions: {
            select: {
                id: true
            }
        }
    };
}>;
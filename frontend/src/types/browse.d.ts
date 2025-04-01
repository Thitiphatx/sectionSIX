
export type BrowseItem = Prisma.ClustersGetPayload<{
    include: {
        ClusterVersions: {
            select: {
                id: true,
                status: true
            }
        }
    };
}>;
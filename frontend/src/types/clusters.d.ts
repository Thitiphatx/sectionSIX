import { Prisma } from '@prisma/client';

export type ClusterWithVersion = Prisma.ClustersGetPayload<{
    include: {
        ClusterVersions: {
            include: {
                Images: {
                    select: {
                        id: true
                    }
                }
            }
        }
    };
}>;


export type ClustersContextType = {
    clusters: Clusters[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export type ClusterWithImage = Prisma.ClusterVersionsGetPayload<{
    include: {
        Images: true
    };
}>;
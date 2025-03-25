
import ErrorPage from "@/components/error";
import VersionList from "@/components/dashboard/cluster/versionList";
import ClusterInfo from "@/components/clusters/cluster_info";
import prisma from "@/libs/prisma"
import { Prisma } from "@prisma/client";

export type ClusterWithVersionWithImage = Prisma.ClustersGetPayload<{
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
    }
}>;

export type VersionWithImage = Prisma.ClusterVersionsGetPayload<{
    include: {
        Images: {
            select: {
                id: true
            }
        }
    }
}>

export default async function page({ params }: { params: Promise<{ clusterId: string }> }) {
    const { clusterId } = await params;
    const data = await prisma.clusters.findFirst({
        where: { id: clusterId },
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
        }
    })

    if (!data) {
        return (
            <ErrorPage message="No cluster data" />
        )
    }

    return (
        <div className="bg-zinc-100 min-h-svh p-4 flex flex-col gap-2">
            <ClusterInfo data={data}/>
            <VersionList data={data} isDashboard={true} />
        </div>
    )
}

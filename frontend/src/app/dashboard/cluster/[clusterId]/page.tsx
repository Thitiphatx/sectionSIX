import ClusterDetail from "@/components/clusters/cluster_detail"
import ErrorPage from "@/components/error";
import prisma from "@/libs/prisma"

export default async function page({ params }: { params: Promise<{ clusterId: string }> }) {
    const { clusterId } = await params;
    const data = await prisma.clusters.findFirst({
        where: { id: clusterId },
        include: {
            ClusterVersions: true
        }
    })

    if (!data) {
        return (
            <ErrorPage message="No cluster data" />
        )
    }

    return (
        <ClusterDetail data={data} />
    )
}

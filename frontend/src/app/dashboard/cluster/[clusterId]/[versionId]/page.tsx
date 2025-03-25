import VersionDetail from "@/components/clusters/version_detail";
import ErrorPage from "@/components/error";
import prisma from "@/libs/prisma";

export default async function VersionPage({ params }: { params: Promise<{ versionId: string }> }) {
    const { versionId } = await params;
    const data = await prisma.clusterVersions.findFirst({
        where: { id: versionId },
        include: {
            Images: true
        }
    })

    if (!data) {
        return (
            <ErrorPage message="Cluster does not exist"/>
        )
    }

    return (
        <div>
            <VersionDetail data={data} />
        </div>
    )
}

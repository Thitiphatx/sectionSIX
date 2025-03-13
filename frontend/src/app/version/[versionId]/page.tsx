
import VersionDetail from "@/components/version/version_detail";
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";


export default async function VersionLanding({ params }: { params: Promise<{ versionId: string }> }) {
    const { versionId } = await params;
    if (!versionId) {
        return (<div>No version Id</div>)
    }

    const data = await prisma.clusterVersions.findFirst({
        where: { id: versionId }
    });

    const address = await prisma.clusters.findFirst(({
        where: {
            ClusterVersions: {
                some: {
                    id: versionId
                }
            }
        },
        select: {
            address: true
        }
    }))

    const session = await auth();
    const isOwned = await prisma.transaction.findFirst(({
        where: { 
            user_id: session?.user.id,
            version_id: versionId
        }
    }))
    if (!data) return <div>No data</div>
    return (
        <div className="max-w-screen-xl mx-auto">
            <VersionDetail data={data} isOwned={isOwned ? true : false} address={address?.address ?? ""}/>
        </div>
    )
}

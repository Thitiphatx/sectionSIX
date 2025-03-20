"use server"

import ViewerDetail from "@/components/viewer/detail";
import prisma from "@/libs/prisma";


export default async function ViewerLanding({ params }: { params: { versionId: string } }) {
    const { versionId } = await params;
    const data = await prisma.clusterVersions.findFirst({
        where: { id: versionId }
    })

    if (!data) {
        return (
            <div>No</div>
        )
    }

    return (
        <div>
            <ViewerDetail data={data} />
        </div>
    )
}

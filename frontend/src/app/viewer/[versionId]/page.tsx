"use server"

import Purchase from "@/components/cluster/purchase";
import ViewerDetail from "@/components/viewer/detail";
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";


export default async function ViewerLanding({ params }: { params: { versionId: string } }) {
    const { versionId } = await params;
    const session = await auth();
    const data = await prisma.clusterVersions.findFirst({
        where: { id: versionId }
    })

    if (!data) {
        return (
            <div>No{process.env.NEXT_PUBLIC_API_URL}</div>
        )
    }

    const isOwned = await prisma.transaction.findFirst({
        where: {
            user_id: session?.user.id,
            version_id: versionId
        }
    })

    if (isOwned) {
        return (
            <div>
                <ViewerDetail data={data} />
            </div>
        )
    } else {
        return (
            <div>
                <Purchase versionData={data} />
            </div>
        )
    }

}

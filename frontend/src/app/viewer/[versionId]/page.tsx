"use server"

import Purchase from "@/components/cluster/purchase";
import ViewerDetail from "@/components/viewer/detail";
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export type versionWithCluster = Prisma.ClusterVersionsGetPayload<{
    include: {
        cluster: {
            select: {
                address: true,
                road: true,
            }
        }
    }
}>

export type ImagesExport = Prisma.ImagesGetPayload<{
    select: {
        latitude: true,
        longitude: true,
        timestamp: true,
        classes: true
    }
}>

export default async function ViewerLanding({ params }: { params: { versionId: string } }) {
    const { versionId } = await params;
    const session = await auth();

    const data = await prisma.clusterVersions.findFirst({
        where: { id: versionId },
        include: {
            cluster: {
                select: {
                    address: true,
                    road: true,
                }
            }
        }
    })

    if (!data) {
        return (
            <div>No data available</div>
        )
    }

    const isOwned = await prisma.transaction.findFirst({
        where: {
            user_id: session?.user.id,
            version_id: versionId,
            status: "SUCCESS"
        }
    })

    const images = await prisma.images.findMany({
        where: { version_id: versionId },
        select: {
            latitude: true,
            longitude: true,
            timestamp: true,
            classes: true
        }
    })

    if (isOwned) {
        return (
            <div>
                <ViewerDetail data={data} images={images} />
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

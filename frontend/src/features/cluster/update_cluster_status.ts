"use server"

import prisma from "@/libs/prisma";
import { ClusterVersionStatus } from "@prisma/client";

export async function update_cluster_status(clusterId: string, status: ClusterVersionStatus) {
    await prisma.clusterVersions.update({
        where: { id: clusterId },
        data: { status }
    })
}
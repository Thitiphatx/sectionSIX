"use server"

import prisma from "@/libs/prisma"
import { ClusterVersionStatus } from "@prisma/client"

export default async function update_cluster_version(clusterVersionId: string, basePrice: number, status: ClusterVersionStatus) {
	try {
		await prisma.clusterVersions.update({
			where: { id: clusterVersionId },
			data: {
				price: basePrice,
				status
			}

		})
	} catch (error) {
		console.log(error);
		return { message: "Database is offline" }
	}
}

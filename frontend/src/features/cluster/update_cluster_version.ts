"use server"

import prisma from "@/libs/prisma"
import { ClusterVersionStatus } from "@prisma/client"

export default async function update_cluster_version(clusterVersionId: string, basePrice: number, classPrice: number, status: ClusterVersionStatus) {
	try {
		await prisma.clusterVersions.update({
			where: { id: clusterVersionId },
			data: {
				price: basePrice,
				price_per_class: classPrice,
				status
			}

		})
	} catch (error) {
		return { message: "Database is offline" }
	}
}

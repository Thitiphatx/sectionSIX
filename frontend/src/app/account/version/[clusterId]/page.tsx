import VersionList from '@/components/dashboard/cluster/versionList'
import { auth } from '@/libs/auth'
import prisma from '@/libs/prisma'
import { notFound } from 'next/navigation'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

export default async function VersionsPage({ params }: { params: { clusterId: string } }) {
    const { clusterId } = await params
    const session = await auth();

    const clusterVersions = await prisma.clusters.findUnique({
        where: {
            id: clusterId,
            ClusterVersions: {
                some: {
                    Transaction: {
                        some: {
                            user_id: session?.user.id,
                            status: "SUCCESS" // Ensuring the transaction was successful
                        }
                    }
                }
            }
        },
        include: {
            ClusterVersions: {
                where: {
                    status: 'ACTIVE'
                },
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

    if (!clusterVersions) {
        return (
            <div>
                No available item here
            </div>
        )
    }


    return (
        <div>
            <Card className="p-4 w-full">
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        Versions for {clusterVersions.address}
                    </h1>
                </div>
                {clusterVersions.ClusterVersions.length === 0 ? (
                    <p className="text-gray-500">No versions found matching your search</p>
                ) : <VersionList data={clusterVersions} isDashboard={false} />}
            </Card>
        </div>
    )
}

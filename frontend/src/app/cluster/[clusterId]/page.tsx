// app/clusters/[clusterId]/versions/page.tsx
import VersionList from '@/components/dashboard/cluster/versionList'
import prisma from '@/libs/prisma'
import { notFound } from 'next/navigation'
import { Card } from 'primereact/card'

export default async function ClusterVersionsPage({ params }: { params: Promise<{ clusterId: string }> }) {
    const { clusterId } = await params
    const clusterVersions = await prisma.clusters.findUnique({
        where: {
            id: clusterId,

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

    if (!clusterVersions) return notFound()

    return (
        <div>
            <Card className="p-4 max-w-screen-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">
                    Versions for {clusterVersions.address}
                </h1>

                {clusterVersions.ClusterVersions.length === 0 ? (
                    <p className="text-gray-500">No versions found matching your search</p>
                ) : <VersionList data={clusterVersions} isDashboard={false}/>}
            </Card>
        </div>
    )
}

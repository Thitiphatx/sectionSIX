// app/clusters/[clusterId]/versions/page.tsx
import VersionItem from '@/components/version/version_item'
import prisma from '@/libs/prisma'
import { notFound } from 'next/navigation'
import { Card } from 'primereact/card'

interface PageProps {
    params: { clusterId: string }
}

export default async function ClusterVersionsPage({ params }: PageProps) {
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

                <div className="grid grid-cols-3 gap-4">
                    {clusterVersions.ClusterVersions.map((version) => (
                        <VersionItem item={version} key={version.id} href={`/viewer/${version.id}`} />
                    ))}

                    {clusterVersions.ClusterVersions.length === 0 && (
                        <p className="text-gray-500">No versions found matching your search</p>
                    )}
                </div>
            </Card>
        </div>
    )
}

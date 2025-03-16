// app/clusters/[clusterId]/versions/page.tsx
import VersionItem from '@/components/version/version_item'
import prisma from '@/libs/prisma'
import { notFound } from 'next/navigation'

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
                }
            }
        }
    })

    if (!clusterVersions) return notFound()

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Versions for {clusterVersions.address}
            </h1>

            <div className="grid grid-cols-3 gap-4">
                {clusterVersions.ClusterVersions.map((version) => (
                    <VersionItem item={version} key={version.id} href={`/version/${version.id}`}/>
                ))}

                {clusterVersions.ClusterVersions.length === 0 && (
                    <p className="text-gray-500">No versions found matching your search</p>
                )}
            </div>
        </div>
    )
}

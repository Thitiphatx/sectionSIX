import prisma from "@/libs/prisma";
import ErrorPage from "@/components/error";
import ClusterList from "@/components/clusters/list";

export default async function Cluster() {
    try {
        const clusters = await prisma.clusters.findMany();
        return (
            <div>
                <ClusterList data={clusters}/>
            </div>
        )
    } catch (error) {
        return (
            <ErrorPage message="Database is offline"/>
        )
    }

}


import ErrorPage from "@/components/error";
import ClusterList from "@/components/dashboard/cluster/clusterList";

export default async function Cluster() {
    try {
        return <ClusterList />
    } catch (error) {
        return (
            <ErrorPage message="Database is offline" />
        )
    }

}

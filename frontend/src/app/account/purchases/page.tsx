import ClusterList from "@/components/account/myPurchases/clusterList";
import { auth } from "@/libs/auth";

export default async function Profile() {
    const session = await auth();
    if (!session) return <div>Unauthorized</div>;

    return (
        <div>
            <ClusterList />
        </div>
    )
}

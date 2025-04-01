"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "primereact/card"
import { useEffect, useState, Suspense } from "react";
import BrowseSearch from "../../browse/search";
import Image from "next/image";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import Link from "next/link";
import { ProgressSpinner } from "primereact/progressspinner";
import { BrowseItem } from "@/types/browse";
import { getMyCluster } from "@/features/account/getMycluster";
import { useSession } from "next-auth/react";

// Content component that uses searchParams
function ClusterListContent() {
    const [clusterData, setClusterData] = useState<BrowseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const query = searchParams.get("s") || "";
        handleSearch(query);
    }, [searchParams])

    async function handleSearch(query: string) {
        setLoading(true);
        // Update the URL (without reloading the page)
        router.push(`?s=${query}`, { scroll: true });
        // Fetch data from the server
        const result = await getMyCluster(query, session?.user.id ?? "");
        setClusterData(result);
        setLoading(false);
    }

    return (
        <div className="min-h-screen w-full bg-zinc-100 p-4 space-y-2">
            {/* Search */}
            <Card>
                <BrowseSearch onSearch={handleSearch} defaultQuery={searchParams.get("s") || ""} />
            </Card>
            {/* grid */}
            <Card className="p-4" pt={{ content: { className: "space-y-4" } }}>
                <h1 className="text-xl font-bold">All address ({clusterData.length})</h1>
                {loading ? (
                    <div className="text-center">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
                        {clusterData.length > 0 && clusterData.map((item) => (
                            <Link href={`/account/version/${item.id}`} key={item.id} className="rounded-xl h-fit bg-white ring-1 ring-zinc-300">
                                <Image
                                    className="w-full h-40 object-cover rounded-xl"
                                    alt={item.address || "Cluster thumbnail"}
                                    width={400}
                                    height={300}
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/preview/${item.id}/${item.ClusterVersions[0].id}`}
                                />
                                <div className="p-4">
                                    <div className="flex flex-row justify-between">
                                        <span className="font-extrabold text-lg">{item.name}</span>
                                        <Tag value={item.ClusterVersions.length}></Tag>
                                    </div>
                                    <div className="flex flex-row items-center gap-2 text-zinc-500">
                                        <i className="pi pi-map-marker"></i>
                                        <span className="line-clamp-1 text-sm">{item.address}</span>
                                    </div>
                                    <Divider />
                                    <div className="flex flex-row items-center gap-2 text-zinc-500">
                                        <i className="pi pi-calendar"></i>
                                        <span className="line-clamp-1 text-sm">{item.created_at.toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

// Main component with Suspense
export default function ClusterList() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-zinc-100 p-4 space-y-2">
                {/* Search fallback */}
                <Card>
                    <div className="h-12 animate-pulse bg-gray-200 rounded"></div>
                </Card>
                {/* Grid fallback */}
                <Card className="p-4">
                    <h1 className="text-xl font-bold">All address</h1>
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-2 mt-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-xl h-64 animate-pulse bg-gray-200"></div>
                        ))}
                    </div>
                </Card>
            </div>
        }>
            <ClusterListContent />
        </Suspense>
    );
}
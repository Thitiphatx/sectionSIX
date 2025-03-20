"use client"

import { Clusters } from "@prisma/client"
import ClusterGrid from "./grid";
import ClusterSearch from "./search";
import { ClustersProvider } from "@/contexts/clusters/clustersContext";
import { getClusters } from "@/features/cluster/search";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClusterList({ data }: { data: Clusters[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [clusters, setClusters] = useState<Clusters[]>(data);
    const [loading, setLoading] = useState(false);

    // Get query from URL on load
    useEffect(() => {
        const query = searchParams.get("s");
        if (query) {
            handleSearch(query);
        }
    }, []);

    // Handle search and update URL
    async function handleSearch(query: string) {
        setLoading(true);

        // Update the URL (without reloading the page)
        router.push(`?s=${query}`, { scroll: false });

        // Fetch data from the server
        const result = await getClusters(query);
        setClusters(result);

        setLoading(false);
    }
    
    return (
        <ClustersProvider data={data}>
            <ClusterSearch onSearch={handleSearch} defaultQuery={searchParams.get("s") || ""}/>
            <ClusterGrid clusters={clusters} isLoading={loading}/>
        </ClustersProvider>
    )
}

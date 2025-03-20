"use client"

import { Clusters } from "@prisma/client"
import { getClusters } from "@/features/cluster/search";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrowseSearch from "./search";
import BrowseGrid from "./grid";
import { Card } from "primereact/card";
import { BrowseItem } from "@/types/browse";

export default function BrowseList() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [clusters, setClusters] = useState<BrowseItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Get query from URL on load
    useEffect(() => {
        const query = searchParams.get("s") || "";
        handleSearch(query);
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
        <div className="p-4 max-w-screen-xl mx-auto">
            <Card>
                <BrowseSearch onSearch={handleSearch} defaultQuery={searchParams.get("s") || ""} />
                <BrowseGrid isLoading={loading} clusters={clusters} />
            </Card>
        </div>
    )
}

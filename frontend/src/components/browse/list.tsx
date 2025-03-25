"use client"

import { Clusters } from "@prisma/client"
import { getClusters } from "@/features/cluster/search";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrowseSearch from "./search";
import BrowseGrid from "./grid";
import { Card } from "primereact/card";
import { BrowseItem } from "@/types/browse";
import BrowseFilter, { Filter } from "./filter";

export default function BrowseList() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [clusters, setClusters] = useState<BrowseItem[]>([]);
    const [loading, setLoading] = useState(false);
    // const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

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
        let result = await getClusters(query, false);

        // Filter clusters if selectedFilters is not empty
        // if (selectedFilters.length > 0) {
        //     result = result.filter(cluster =>
        //         cluster.ClusterVersions.some(version => {
        //             // Ensure classes is parsed properly
        //             const classArray: number[] = version.classes ? JSON.parse(version.classes.toString()) : []

        //             // Check if any selectedFilters exist in the classArray
        //             return classArray.some(classId => selectedFilters.includes(classId));
        //         })
        //     );
        // }

        setClusters(result);
        setLoading(false);
    }

    return (
        <div className="max-w-screen-xl mx-auto bg-zinc-100 p-4">
            <div className="flex flex-col gap-2 min-h-svh">
                <Card>
                    <BrowseSearch onSearch={handleSearch} defaultQuery={searchParams.get("s") || ""} />
                </Card>
                <Card className="min-h-screen">
                    {/* <BrowseFilter setSelectedFilters={setSelectedFilters} selectedFilters={selectedFilters} /> */}
                    <BrowseGrid isLoading={loading} clusters={clusters} />
                </Card>
            </div>
        </div>
    )
}

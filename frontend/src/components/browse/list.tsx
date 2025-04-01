"use client"
import { getClusters } from "@/features/cluster/search";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrowseSearch from "./search";
import BrowseGrid from "./grid";
import { Card } from "primereact/card";
import { BrowseItem } from "@/types/browse";

// Create a wrapper component that uses searchParams
function BrowseListContent() {
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
        const result = await getClusters(query, false);
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
    );
}

// Main component with Suspense
export default function BrowseList() {
    return (
        <Suspense fallback={
            <div className="max-w-screen-xl mx-auto bg-zinc-100 p-4">
                <div className="flex flex-col gap-2 min-h-svh">
                    <Card>
                        <div className="h-12 animate-pulse bg-gray-200 rounded"></div>
                    </Card>
                    <Card className="min-h-screen">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="h-40 animate-pulse bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        }>
            <BrowseListContent />
        </Suspense>
    );
}
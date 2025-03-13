"use client"

import { ClustersContextType } from "@/types/clusters";
import { Clusters } from "@prisma/client";
import { createContext, useState } from "react";

export const ClustersContext = createContext<ClustersContextType | undefined>(undefined);

export function ClustersProvider({ children, data }: { children: React.ReactNode; data: Clusters[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <ClustersContext.Provider value={{ clusters: data, searchQuery, setSearchQuery }}>
            {children}
        </ClustersContext.Provider>
    );
}
"use client"

import { ClusterWithVersion } from "@/types/clusters";
import { createContext, useContext } from "react";

export const ClusterContext = createContext<ClusterWithVersion | undefined>(undefined); 

export const useClusterContext = ()=> {
    const data = useContext(ClusterContext);

    if (!data) {
        throw new Error("useClusterContext must be used in ClusterContext")
    }
    return data;
}
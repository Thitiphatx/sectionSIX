"use client"
import { ClusterWithImage } from "@/types/clusters";
import { createContext, useContext } from "react";

export const VersionContext = createContext<ClusterWithImage | undefined>(undefined);

export function useVersionContext() {
    const context = useContext(VersionContext);

    if (!context) {
        throw new Error("useVersionContext must be used in VersionContext")
    }
    return context;
}
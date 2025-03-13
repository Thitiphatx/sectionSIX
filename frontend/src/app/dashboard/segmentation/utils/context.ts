"use client"
import { Clusters } from "@prisma/client";
import { createContext, useContext } from "react";

export const SegmentContext = createContext<Clusters[] | undefined>(undefined); 

export const useSegmentContext = ()=> {
    const data = useContext(SegmentContext);

    if (!data) {
        throw new Error("useSegmentContext must be used in SegmentContext")
    }
    return data;
}
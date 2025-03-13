"use client"

import { ClusterWithImage, ClusterWithVersion } from "@/types/clusters";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

type ClusterContextProp = {
    selectedVersion: ClusterWithImage;
    setSelectedVersion: Dispatch<SetStateAction<ClusterWithImage>>;
    purchaseClasses: number[];
    setPurchaseClasses: Dispatch<SetStateAction<number[]>>;
    displayClasses: number[];
    setDisplayClasses: Dispatch<SetStateAction<number[]>>;
    data: ClusterWithVersion;
    videoLoading: boolean;
    setVideoLoading: Dispatch<SetStateAction<boolean>>;
}


export const ClusterContext = createContext<ClusterContextProp | undefined>(undefined); 

export const useClusterContext = ()=> {
    const data = useContext(ClusterContext);

    if (!data) {
        throw new Error("useClusterContext must be used in ClusterContext")
    }
    return data;
}
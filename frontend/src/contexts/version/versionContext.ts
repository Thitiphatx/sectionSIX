"use client"

import { ClusterVersions } from "@prisma/client";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

type VersionContextProps = {
    data: ClusterVersions;
    classList: number[];
    setClassList: Dispatch<SetStateAction<number[]>>;
    loadVideo: boolean;
    setLoadVideo: Dispatch<SetStateAction<boolean>>;
    showLabel: boolean;
    setShowLabel: Dispatch<SetStateAction<boolean>>;
    address: string
}

export const VersionContext = createContext<VersionContextProps | undefined>(undefined);

export function useVersionContext() {
    const data = useContext(VersionContext);

    if (data === undefined) {
        throw new Error("useVersionContext must be use with VersionContext");
    }
    return data;
}
"use client"

import { ClusterVersions } from "@prisma/client";
import { createContext, useContext } from "react";

export const VideoSettingContext = createContext<ClusterVersions[] | undefined>(undefined); 

export const useVideoSettingContext = ()=> {
    const data = useContext(VideoSettingContext);

    if (!data) {
        throw new Error("useVideoSettingContext must be used in VideoSettingContext")
    }
    return data;
}
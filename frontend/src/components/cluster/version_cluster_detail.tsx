"use client"

import { ClusterWithVersion } from "@/types/clusters";
import VideoPlayer from "./player";
import Settings from "./settings";
import Purchase from "./purchase";
import { ClusterContext } from "@/contexts/clusters/clusterContext";
import { useState } from "react";
import VersionSelector from "./version_selector";
import VideoDescription from "./description";

export default function ClusterDetail({ data, isOwned }: { data: ClusterWithVersion, isOwned: boolean }) {

    const [selectedVersion, setSelectedVersion] = useState(data.ClusterVersions[0]);
    const [purchaseClasses, setPurchaseClasses] = useState<number[]>([]);
    const [displayClasses, setDisplayClasses] = useState<number[]>([]);
    const [videoLoading, setVideoLoading] = useState(true);

    return (
        <ClusterContext.Provider value={{
            data,
            selectedVersion,
            setSelectedVersion,
            displayClasses,
            setDisplayClasses,
            purchaseClasses,
            setPurchaseClasses,
            videoLoading,
            setVideoLoading
        }}>
            <div className="max-w-screen-xl mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <VideoPlayer />
                        <VideoDescription />
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        <VersionSelector />
                        {isOwned ? <Settings /> : <Purchase />}
                        
                        
                    </div>
                </div>
            </div>
        </ClusterContext.Provider>

    )
}

"use client"

import { ClusterVersions } from "@prisma/client"
import VideoDescription from "../cluster/description"
import VideoPlayer from "../cluster/player"
import { VersionContext } from "@/contexts/version/versionContext"
import Settings from "../cluster/settings"
import { useState } from "react"
import Purchase from "../cluster/purchase"
import Player2 from "./player"

export default function VersionDetail({ data, isOwned, address }: { data: ClusterVersions, isOwned: boolean, address: string }) {
    const [classes, setClasses] = useState<number[]>([]);
    const [loadVideo, setLoadVideo] = useState<boolean>(false);
    const [showLabel, setShowLabel] = useState<boolean>(true);
    return (
        <VersionContext.Provider value={{
            data, classList: classes, setClassList:setClasses, loadVideo, setLoadVideo, showLabel, setShowLabel, address
        }
        }>
            <div className="max-w-screen-xl mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Player2 url={"/video_1.mp4"} />
                        <VideoPlayer />
                        <VideoDescription />
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        {isOwned ?
                        <Settings />
                        : <Purchase />
                    }
                    </div>
                </div>
            </div>

        </VersionContext.Provider>
    )
}

"use client"

import { Card } from "primereact/card"
import Player2 from "@/components/version/player"
import { ClusterContext } from "@/contexts/clusters/clusterContext"


export default function ClusterDashboard({ data }: { data: ClusterWithVersionImage }) {
    return (
        <div>
            <ClusterContext.Provider value={data}>
                <Card title="test">
                    <div className="grid grid-cols-2 gap-5">
                        <Player2 />
                    </div>

                </Card>
            </ClusterContext.Provider>
        </div>
    )
}

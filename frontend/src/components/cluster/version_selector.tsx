"use client"

import { useClusterContext } from "@/contexts/clusters/clusterContext";
import { Dropdown } from "primereact/dropdown"

export default function VersionSelector() {
    const { data, selectedVersion, setSelectedVersion } = useClusterContext();
    const videoVersionOptions = data.ClusterVersions.map((v) => ({
        label: `${v.version}`,
        value: v
    }))

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Select Version</h3>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <label className="text-sm">Version:</label>
                    <Dropdown
                        value={selectedVersion}
                        options={videoVersionOptions}
                        onChange={(e) => setSelectedVersion(e.value)}
                        className="w-40"
                    />
                </div>
            </div>
        </div>
    )
}

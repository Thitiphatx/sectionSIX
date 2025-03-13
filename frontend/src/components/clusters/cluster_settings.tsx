"use client"

import { useClusterContext } from "@/contexts/clusters/clusterContext";
import { Card } from "primereact/card";

export default function ClusterSettings() {
    const context = useClusterContext();
    return (
        <Card className="shadow-md border-0">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <i className="pi pi-map-marker text-blue-500"></i>
                            <h2 className="text-xl font-bold text-gray-800">{context.road}</h2>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span className="mr-3 flex items-center">
                                <i className="pi pi-calendar mr-1"></i>
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-md font-semibold mb-2">Location Details</h3>
                    <p className="text-gray-700">{context.address}</p>
                </div>
            </div>
        </Card>
    )
}

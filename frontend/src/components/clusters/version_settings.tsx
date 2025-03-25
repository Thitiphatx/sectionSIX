"use client"

import { useVersionContext } from "@/contexts/clusters/versionContext";
import update_cluster_version from "@/features/cluster/update_cluster_version";
import { ClusterVersionStatus } from "@prisma/client";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber"
import { Toast } from "primereact/toast";
import { ToggleButton } from "primereact/togglebutton";
import { useRef, useState } from "react";

export default function VersionSettings() {
    const context = useVersionContext();
    const toast = useRef<Toast>(null);
    const [price, setPrice] = useState({
        basePrice: context.price,
    });
    const [onSell, setOnSell] = useState(context.status === "ACTIVE");
    const [loading, setLoading] = useState<boolean>(false);

    const getStatus = (bool: boolean)=> {
        const status: ClusterVersionStatus = (bool) ? "ACTIVE" : "DEACTIVE"
        return status
    }

    const applySettings = async () => {
        setLoading(true);
        try {
            await update_cluster_version(context.id, price.basePrice, getStatus(onSell));
            toast.current?.show({
                severity: 'success',
                summary: 'Settings Applied',
                detail: 'Cluster settings have been updated successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update cluster settings',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }

    // Check if the cluster status is "UNPROCESS"
    const isUnprocessed = context.status === "UNPROCESS";

    return (
        <>
            <Toast ref={toast} />
            <div className="p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-200 flex items-center">
                    <i className="pi pi-cog mr-2"></i>
                    Cluster Settings
                </h3>
                <div className="space-y-6">
                    <h4 className="font-medium mb-3 flex items-center">
                        <i className="pi pi-dollar mr-2 text-green-500"></i>
                        Price Settings
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Base Price:</label>
                            <InputNumber
                                value={price.basePrice}
                                onValueChange={(e) => setPrice((prev) => ({ ...prev, basePrice: e.value || 0 }))}
                                mode="currency"
                                currency="THB"
                                locale="th-TH"
                                className="w-full"
                                showButtons
                                min={0}
                            />
                        </div>
                    </div>
                    <Divider />
                    {/* Display Settings Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center">
                            <i className="pi pi-eye mr-2 text-purple-500"></i>
                            Display Settings
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Show On sell:</label>
                                <ToggleButton
                                    checked={onSell}
                                    onChange={(e) => setOnSell(e.value)}
                                    onLabel="On"
                                    offLabel="Off"
                                    className="w-24"
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    disabled={isUnprocessed}
                                />
                            </div>
                            {isUnprocessed && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                                    <div className="flex items-center">
                                        <i className="pi pi-exclamation-triangle mr-2 text-yellow-600"></i>
                                        <p className="text-yellow-600 text-sm">
                                            Please upload images and process the segmentation first before enabling "On Sell" status.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="pt-2">
                        <Button
                            label="Apply Changes"
                            icon="pi pi-check"
                            className="w-full"
                            loading={loading}
                            onClick={applySettings}
                        />
                        <Button
                            label="Reset"
                            icon="pi pi-refresh"
                            className="w-full mt-2 p-button-outlined p-button-secondary"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
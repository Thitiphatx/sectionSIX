"use client"
import { useResourceContext } from "@/contexts/resources/context";
import { resourceStatusColor } from "@/features/resources/resource_status_color";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";

export default function ResourceCluster() {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const data = useResourceContext();
    const toast = useRef<Toast>(null);
    const [extractionComplete, setExtractionComplete] = useState(false);

    // Check if extraction has already been performed
    useEffect(() => {
        if (data.status === "CLUSTERED") {
            setExtractionComplete(true);
        }
    }, [data.status]);

    const startExtraction = async () => {
        // Check if resource is ready for extraction
        if (data.status !== "READY") {
            toast.current?.show({
                severity: 'error',
                summary: 'Unable to Start',
                detail: 'Resource must be in READY status before extraction can begin',
                life: 5000
            });
            return;
        }

        // Check if there are images to process
        if (!data.Images || data.Images.length === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'No Images',
                detail: 'No images available for clustering',
                life: 5000
            });
            return;
        }

        try {
            setLoading(true);
            setProgress(0);

            const eventSource = new EventSource(`/api/startExtraction?resourceId=${data.id}`);

            eventSource.onmessage = (event) => {
                const progressData = JSON.parse(event.data);
                setProgress(progressData.progress);

                if (progressData.progress >= data.Images.length) {
                    eventSource.close();
                    setLoading(false);
                    setExtractionComplete(true);

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Extraction Complete',
                        detail: 'Clustering process has been successfully completed',
                        life: 5000
                    });
                }
            };

            eventSource.onerror = (error) => {
                console.error("EventSource failed:", error);
                eventSource.close();
                setLoading(false);

                toast.current?.show({
                    severity: 'error',
                    summary: 'Extraction Failed',
                    detail: 'An error occurred during the clustering process',
                    life: 5000
                });
            };
        } catch (error) {
            setLoading(false);
            console.error("Error starting extraction:", error);

            toast.current?.show({
                severity: 'error',
                summary: 'Extraction Failed',
                detail: 'Failed to initiate the clustering process',
                life: 5000
            });
        }
    };

    const getProgressPercentage = () => {
        if (!data.Images || data.Images.length === 0) return 0;
        return Math.floor((progress / data.Images.length) * 100);
    };

    const progressPercentage = getProgressPercentage();

    const header = (
        <div className="flex items-center gap-2 pl-5 pt-5">
            <i className="pi pi-sitemap text-xl"></i>
            <h2 className="text-xl font-medium m-0">Cluster Extraction</h2>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Card className="shadow-md border border-gray-100 rounded-lg" header={header}>
                <div className="mb-4">
                    <Message
                        severity={resourceStatusColor(data.status) as any}
                        className="w-full mb-4"
                        content={
                            <span className="font-medium mb-1 flex items-center gap-2">Resource Status: <Tag severity={resourceStatusColor(data.status)}>{data.status}</Tag></span>
                        }
                    />

                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                        <div className="flex items-start gap-3">
                            <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                            <div>
                                <h3 className="text-blue-800 text-sm font-bold m-0 mb-1">How Clustering Works</h3>
                                <p className="text-blue-800 text-sm m-0">
                                    When starting the process, images will be analyzed and grouped by road segments.
                                    The result will appear in the cluster view. Processing time depends on the quantity of images.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {data.Images && (
                            <span>Total images: <strong>{data.Images.length}</strong></span>
                        )}
                    </div>

                    <Button
                        label={extractionComplete ? "Extraction Complete" : "Start Extraction"}
                        icon={extractionComplete ? "pi pi-check" : "pi pi-play"}
                        className={extractionComplete ? "p-button-success" : "p-button-primary"}
                        onClick={startExtraction}
                        loading={loading}
                        disabled={loading || extractionComplete || data.status !== "READY"}
                    />
                </div>

                {loading && (
                    <div className="mt-4">
                        <ProgressBar
                            value={progressPercentage}
                            showValue={true}
                            className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Processing images...</span>
                            <span>
                                <strong>{progress}</strong> of <strong>{data.Images?.length || 0}</strong> images
                            </span>
                        </div>
                    </div>
                )}

                {extractionComplete && !loading && (
                    <div className="mt-4 p-3 bg-green-50 rounded border-green-100 text-green-800 text-sm">
                        <div className="flex items-center gap-2">
                            <i className="pi pi-check-circle text-green-500"></i>
                            <span>Clustering has been successfully completed. View the results in the cluster section.</span>
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
}
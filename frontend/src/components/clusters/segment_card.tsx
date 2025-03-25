import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Dialog } from "primereact/dialog";

import { useVersionContext } from "@/contexts/clusters/versionContext";
import { update_cluster_status } from "@/features/cluster/update_cluster_status";
import { saveSegmentedClass, saveSegmentedImage } from "@/features/resources/save_segment_result";

export default function SegmentCard() {
    const context = useVersionContext();
    const [modelList, setModelList] = useState<string[]>([]);
    const [progress, setProgress] = useState<number | null>(null);
    const [currentImage, setCurrentImage] = useState('');
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/segmentation/list`);
                if (!response.ok) return null;

                const result = await response.json();
                setModelList(result.models);
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };

        fetchModels();
    }, []);

    const handleSegmentation = async () => {
        if (!selectedModel) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Please select a model", life: 3000 });
            return;
        }

        // Check if segmentation already exists
        const hasExistingSegmentation = context.status !== "UNPROCESS"

        if (hasExistingSegmentation) {
            setShowConfirmDialog(true);
            return;
        }

        performSegmentation();
    };

    const performSegmentation = async () => {
        try {
            const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/segmentation/start?model=${selectedModel}&resourceId=${context.Images[0].resource_id}&clusterId=${context.cluster_id}&versionId=${context.id}`);

            eventSource.onmessage = async (event) => {
                const result = JSON.parse(event.data);
                setProgress(result.progress);
                setCurrentImage(result.current_image);
                
                await saveSegmentedImage(context.Images[0].resource_id, result.current_image, result.unique_class);

                if (result.progress === 100) {
                    eventSource.close();
                    await update_cluster_status(context.id, "DEACTIVE");
                    await saveSegmentedClass(context.id, result.unique_class);
                    toast.current?.show({
                        severity: "success",
                        summary: "Segmentation Complete",
                        detail: "Images have been successfully segmented",
                        life: 3000
                    });
                }
            };

            eventSource.onerror = function () {
                console.log("error with SSE connection");
            };

        } catch (error) {
            console.log(error);
        }
    };

    const confirmSegmentation = () => {
        setShowConfirmDialog(false);
        performSegmentation();
    };

    const progressTemplate = (value: number) => {
        return (
            <div className="text-sm font-medium text-gray-700">
                {value}/{100}%
            </div>
        )
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <Toast ref={toast} />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSegmentation();
                    }}
                    className="space-y-4"
                >
                    {modelList.length > 0 ? (
                        <div className="flex space-x-2">
                            <Dropdown
                                name="model_id"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.value)}
                                options={modelList}
                                placeholder="Select a Model"
                                className="flex-grow"
                            />
                            <Button
                                type="submit"
                                label="Start"
                                severity="success"
                                className="px-4 py-2 rounded-md"
                            />
                        </div>
                    ) : (
                        <Message
                            severity="error"
                            text="Cannot connect to the server"
                            className="w-full"
                        />
                    )}
                </form>

                {progress !== null && (
                    <div className="space-y-2">
                        <ProgressBar
                            value={progress}
                            displayValueTemplate={progressTemplate}
                            className="bg-gray-200"
                        />
                        {progress !== 100 && (
                            <p className="text-xs text-gray-500 truncate">
                                Processing: {currentImage}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <Dialog
                header="Confirm Segmentation"
                visible={showConfirmDialog}
                style={{ width: '450px' }}
                modal
                className="p-confirm-dialog"
                onHide={() => setShowConfirmDialog(false)}
                footer={
                    <div className="flex justify-end space-x-2">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            outlined
                            severity="secondary"
                            onClick={() => setShowConfirmDialog(false)}
                        />
                        <Button
                            label="Confirm"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={confirmSegmentation}
                        />
                    </div>
                }
            >
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <i className="pi pi-exclamation-triangle text-2xl text-yellow-500"></i>
                        <p className="text-lg font-semibold text-gray-700">
                            Existing Segmentation Detected
                        </p>
                    </div>
                    <p className="text-gray-600">
                        This action will replace the existing segmentation data.
                        Are you sure you want to proceed?
                    </p>
                </div>
            </Dialog>
        </>
    )
}
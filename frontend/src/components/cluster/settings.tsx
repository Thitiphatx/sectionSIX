"use client";

import { useVersionContext } from "@/contexts/version/versionContext";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { ToggleButton } from "primereact/togglebutton";
import { useEffect, useRef, useState } from "react";
import { objectClasses } from "@/types/classes";

export default function Settings() {
    const { data, setClassList, setLoadVideo, setShowLabel, showLabel, setVideoSrc } = useVersionContext();
    const toast = useRef<any>(null);
    const router = useRouter();

    // State for available classes
    const [availableClasses, setAvailableClasses] = useState<number[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    // State for MultiSelect options
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [renderProgress, setRenderProgress] = useState(0);
    // State for current processing image
    const [currentImage, setCurrentImage] = useState('');
    // State for loading status
    const [isLoading, setIsLoading] = useState(false);
    // State for showing object labels
    const [showObjectLabels, setShowObjectLabels] = useState(true);

    // Load available classes first
    useEffect(() => {
        if (data?.classes) {
            try {
                const classes: number[] = JSON.parse(data.classes.toString());
                console.log("Found in video", classes);
                setAvailableClasses(classes);
            } catch (error) {
                console.error("Error parsing classes:", error);
                setAvailableClasses([]);
            }
        }
    }, [data]);

    // Once availableClass is set, update options
    useEffect(() => {
        const newOptions = availableClasses.map((obj) => ({
            label: objectClasses[obj],  // Ensure label is a string
            value: `${obj}`
        }));
        setOptions(newOptions);
        console.log("Options", newOptions);
    }, [availableClasses]);

    const applySettings = async () => {
        if (selectedClasses.length > 0) {
            const settingData = {
                info: {
                    clusterId: data.cluster_id,
                    versionId: data.id,
                },
                settings: {
                    classes: selectedClasses.join(","),
                    showLabel: showObjectLabels
                }
            };
            setVideoURL();
            try {
                setLoadVideo(false);
                setIsLoading(true);
                setRenderProgress(0);
                setCurrentImage('');

                const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/segmentation/render?clusterId=${settingData.info.clusterId}&versionId=${settingData.info.versionId}&showLabel=${settingData.settings.showLabel}&classes=${settingData.settings.classes}`);

                eventSource.onmessage = (event) => {
                    const res = JSON.parse(event.data);
                    setRenderProgress(res.progress);
                    setCurrentImage(res.current_image);

                    // Close the connection when processing is complete
                    if (res.progress === 100) {
                        eventSource.close();
                        setIsLoading(false);
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Video rendered successfully!', life: 3000 });
                        setLoadVideo(true);
                        setClassList(selectedClasses);
                        setShowLabel(showObjectLabels);
                    }
                };

                eventSource.onerror = () => {
                    eventSource.close();
                    setIsLoading(false);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to render video', life: 3000 });
                };

            } catch (error) {
                console.error("Error applying settings:", error);
                setIsLoading(false);
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to apply settings`, life: 3000 });
            }

        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select at least one object class', life: 3000 });
        }
    };

    const setVideoURL = ()=> {
        const sortedClasses = [...selectedClasses].sort();
        const classString = sortedClasses.length > 1 ? sortedClasses.join("_") : sortedClasses[0] || "";
        if (classString !== "") {
            const prefix = showLabel ? "l_" : "nl_";
            const videoName = prefix + classString
            setVideoSrc(`${process.env.NEXT_PUBLIC_API_URL}/video/${data.cluster_id}/${data.id}/${encodeURIComponent(videoName)}.mp4`)
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <Card className="shadow-md">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Video Settings</h3>
                <div className="space-y-6">
                    {/* Object Detection Section */}
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm block mb-2">Display Classes:</label>
                                <MultiSelect
                                    value={selectedClasses.map(v => `${v}`)} // Avoid undefined issues
                                    options={options}
                                    onChange={(e) => setSelectedClasses(e.value.map((v: string) => parseInt(v)))}
                                    display="chip"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Select Objects"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm">Show Labels:</label>
                                <ToggleButton
                                    checked={showObjectLabels}
                                    onChange={(e) => setShowObjectLabels(e.value)}
                                    onLabel="On"
                                    offLabel="Off"
                                    className="w-20"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress Section - Only show when processing */}
                    {isLoading && (
                        <div className="pt-2">
                            <label className="text-sm block mb-2">
                                Processing: {currentImage && `${currentImage.split('/').pop()}`}
                            </label>
                            <ProgressBar value={renderProgress} />
                        </div>
                    )}

                    {/* Apply Button */}
                    <div className="pt-2">
                        <Button
                            label={isLoading ? "Processing..." : "Apply"}
                            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                            className="w-full"
                            onClick={applySettings}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </Card>
        </>
    );
}

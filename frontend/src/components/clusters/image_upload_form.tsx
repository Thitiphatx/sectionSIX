"use client";

import { resizeImage } from "@/features/resources/resize_image";
import { resource_status_validation } from "@/features/resources/resource_status_validation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useVersionContext } from "@/contexts/clusters/versionContext";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

export default function ImageUploadForm() {
    const data = useVersionContext();
    // const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useRef<Toast>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
            setProgress(0); // Reset progress
            
            toast.current?.show({ 
                severity: 'info', 
                summary: 'Files Selected', 
                detail: `${selectedFiles.length} files ready to upload`,
                life: 3000
            });
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const getTotalSize = (): string => {
        const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
        return formatFileSize(totalBytes);
    };

    const clearSelection = () => {
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadChunk = async (file: File, chunk: Blob, index: number, totalChunks: number, totalFiles: number, fileIndex: number) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("index", index.toString());
        formData.append("totalChunks", totalChunks.toString());
        formData.append("fileName", file.name);
        formData.append("resourceId", data.Images[0].resource_id as string);
        formData.append("clusterId", data.cluster_id);
        formData.append("versionId", data.id);

        try {
            console.log("run")
            const result = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            console.log(await result.json());
        } catch(error) {
            console.error("Upload error:", error);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Upload Failed', 
                detail: `Failed to upload ${file.name}`,
                life: 5000
            });
        } finally {
            await resource_status_validation(data.Images[0].resource_id as string);
        }

        // Calculate overall progress
        const uploadedChunks = fileIndex * totalChunks + (index + 1);
        const totalChunksToUpload = totalFiles * totalChunks;
        setProgress(Math.round((uploadedChunks / totalChunksToUpload) * 100));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.current?.show({ 
                severity: 'warn', 
                summary: 'No Files', 
                detail: 'Please select files to upload',
                life: 3000
            });
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const totalFiles = files.length;

        try {
            for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
                const file = files[fileIndex];
                const resizedImage = await resizeImage(file) as File;
                const totalChunks = Math.ceil(resizedImage.size / CHUNK_SIZE);

                for (let i = 0; i < totalChunks; i++) {
                    const start = i * CHUNK_SIZE;
                    const end = Math.min(start + CHUNK_SIZE, resizedImage.size);
                    const chunk = resizedImage.slice(start, end);

                    await uploadChunk(resizedImage, chunk, i, totalChunks, totalFiles, fileIndex);
                }
            }

            toast.current?.show({ 
                severity: 'success', 
                summary: 'Upload Complete', 
                detail: `Successfully uploaded ${files.length} files`,
                life: 5000
            });
            clearSelection();
        } catch (error) {
            console.error("Upload error:", error);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Upload Failed', 
                detail: 'An error occurred during upload',
                life: 5000
            });
        } finally {
            setIsUploading(false);
        }
    };

    const header = (
        <div className="flex items-center gap-2 pl-5 pt-5">
            <i className="pi pi-images text-xl"></i>
            <h2 className="text-xl font-medium m-0">Upload Images</h2>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Card header={header}>
                <div className="mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 text-blue-800 text-sm mb-4">
                        <div className="flex items-center gap-2">
                            <i className="pi pi-info-circle"></i>
                            <span>Images will be automatically resized and processed in chunks</span>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" 
                         onClick={() => fileInputRef.current?.click()}>
                        <input 
                            ref={fileInputRef}
                            id="file-upload" 
                            className="hidden" 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleFileChange} 
                            disabled={isUploading}
                        />
                        
                        <div className="mb-3">
                            <i className="pi pi-cloud-upload text-gray-400 text-5xl"></i>
                        </div>
                        
                        <p className="mb-1 font-medium text-gray-700">
                            {files.length > 0 ? 'Change selection' : 'Drag images here or click to browse'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports only JPEG or JPG formats
                        </p>
                    </div>
                </div>
                
                {files.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-medium text-gray-700">Selected Files</div>
                            {!isUploading && (
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-text p-button-rounded p-button-sm" 
                                    onClick={clearSelection}
                                    tooltip="Clear selection"
                                />
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <i className="pi pi-file-image"></i>
                            <span>{files.length} {files.length === 1 ? 'file' : 'files'} selected</span>
                            <span className="text-gray-500">({getTotalSize()})</span>
                        </div>
                        
                        {files.length <= 5 && (
                            <ul className="list-none p-0 m-0 mt-2">
                                {files.map((file, i) => (
                                    <li key={i} className="text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0 flex justify-between">
                                        <span className="truncate max-w-xs">{file.name}</span>
                                        <span className="text-gray-500">{formatFileSize(file.size)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="flex justify-end">
                    <Button 
                        onClick={handleUpload} 
                        disabled={isUploading || files.length === 0} 
                        icon="pi pi-upload" 
                        label={isUploading ? "Uploading..." : "Upload Images"} 
                        className="p-button-raised"
                        loading={isUploading}
                    />
                </div>

                {isUploading && (
                    <div className="mt-4">
                        <ProgressBar value={progress} showValue className="mb-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Uploading in chunks ({CHUNK_SIZE / (1024 * 1024)}MB per chunk)</span>
                            <span>{progress}% complete</span>
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
}
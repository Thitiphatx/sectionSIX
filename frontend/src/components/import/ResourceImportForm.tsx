"use client";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Convert_XYZ } from "@/features/import/convert_XYZ";
import { import_resource } from "@/features/import/import_resource";
import Link from "next/link";

export default function ResourceImportForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resourceName, setResourceName] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const handleFileSelect = (event: FileUploadSelectEvent) => {
        const file = event.files[0];
        setSelectedFile(file);

        toast.current?.show({
            severity: 'info',
            summary: 'File Selected',
            detail: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
            life: 3000
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile || !resourceName) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please provide both a resource name and file',
                life: 3000
            });
            return;
        }

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event: ProgressEvent<FileReader>) => {
            try {
                const text = event.target?.result as string;
                const rows = text.trim().split("\n");
                const data = rows.slice(1).map((line) => {
                    const [id, image_name, time, X, Y] = line.split(",");
                    console.log(id);
                    const [lon, lat] = Convert_XYZ(parseFloat(X), parseFloat(Y));
                    return {
                        latitude: lat,
                        longitude: lon,
                        timestamp: new Date(parseFloat(time) * 1000),
                        file_name: image_name,
                    };
                });

                const result_id = await import_resource({
                    name: resourceName,
                    created_at: new Date(),
                    Images: data,
                });

                toast.current?.show({
                    severity: 'success',
                    life: 3000,
                    content: () => (
                        <div className="flex flex-col items-left" style={{ flex: '1' }}>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-900">Import Successful</span>
                            </div>
                            <div className="font-medium text-lg my-3 text-900">
                                {`Resource "${resourceName}" imported with ${data.length} images`}
                            </div>
                            <Link href={`/dashboard/resources/${result_id}`} className="p-button" >{`Go to ${resourceName}`}</Link>
                        </div>
                    )
                });

                setSelectedFile(null);
                setResourceName("");
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Import Failed',
                    detail: error instanceof Error ? error.message : "An unknown error occurred.",
                    life: 5000
                });
            } finally {
                setLoading(false);
            }
        };

        reader.readAsText(selectedFile);
    };

    return (
        <div className="w-full">
            <Toast ref={toast} />
            <Card className="rounded-xl shadow-sm">
                <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <i className="pi pi-database text-2xl"></i>
                    <h2 className="text-xl font-semibold text-gray-800 m-0">Import Resource</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="resource_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Resource Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="pi pi-tag text-gray-400"></i>
                            </div>
                            <InputText
                                id="resource_name"
                                name="resource_name"
                                value={resourceName}
                                onChange={(e) => setResourceName(e.target.value)}
                                disabled={loading}
                                placeholder="Enter resource name"
                                className="w-full pl-10 py-2"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter a unique name to identify this resource
                        </p>
                    </div>

                    <Divider className="my-6 border-gray-200" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resource File
                        </label>
                        <FileUpload
                            name="resource"
                            mode="basic"
                            accept=".txt"
                            maxFileSize={1000000}
                            customUpload
                            auto={false}
                            chooseLabel={selectedFile ? selectedFile.name : "Choose .txt File"}
                            onSelect={handleFileSelect}
                            disabled={loading}
                            className="w-full file-upload-tailwind"
                            pt={{
                                chooseButton: {
                                    className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full justify-center'
                                }
                            }}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Upload a .txt file containing the resource data (max 1MB)
                        </p>
                    </div>

                    <Divider className="my-6 border-gray-200" />

                    <div className="flex items-center justify-between">
                        {loading && (
                            <div className="flex items-center text-blue-600">
                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm">Processing...</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !selectedFile || !resourceName}
                            icon="pi pi-upload"
                            className={`ml-auto px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors `}>
                            <span>Import Resource</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
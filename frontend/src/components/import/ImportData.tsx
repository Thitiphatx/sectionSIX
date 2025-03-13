"use client"

import { ChangeEvent, useActionState, useState } from "react";
import { importImage } from "@/app/server-action/import";

export interface ParsedRow {
    id: string;
    image: string;
    time: string;
    x: string;
    y: string;
    z: string;
}

export default function ImportData() {
    const [fileData, setFileData] = useState<ParsedRow[]>([]);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [status, setStatus] = useState<Record<string, string>>({});
    const [state, formAction] = useActionState(importImage, null);

    const handleTextFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const text = event.target?.result as string;
            const rows = text.trim().split("\n");
            const data = rows.slice(1).map((line) => {
                const [
                    id,
                    image,
                    time,
                    x,
                    y,
                    z,
                ] = line.split(",");
                return { id, image, time, x, y, z };
            });
            setFileData(data);
            setStatus({});
        };
        reader.readAsText(file);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(e.target.files || []);
        setUploadedImages(files);

        // Update status based on uploaded images
        const fileNames = files.map((file) => file.name);
        const newStatus: Record<string, string> = {};
        fileData.forEach((row) => {
            newStatus[row.id] = fileNames.includes(row.image) ? "Uploaded" : "Missing";
        });
        setStatus(newStatus);
    };

    return (
        <form action={formAction}>
            <h1>Upload Files</h1>
            <div>
                <label>
                    <strong>Step 1: Upload Text File</strong>
                </label>
                <br />
                <input name="data_info" type="file" accept=".txt" onChange={handleTextFileUpload} />
            </div>
            {fileData.length > 0 && (
                <>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            <strong>Step 2: Upload Image Files</strong>
                        </label>
                        <br />
                        <input name="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    </div>

                    <h2>Parsed Data</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>X</th>
                                <th>Y</th>
                                <th>Z</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fileData.map((row) => (
                                <tr key={row.id} className="text-center">
                                    <td>{row.id}</td>
                                    <td>{row.image}</td>
                                    <td
                                        style={{
                                            color: status[row.id] === "Uploaded" ? "text-green-500" : "text-red-500",
                                        }}
                                    >
                                        {status[row.id] || "Pending"}
                                    </td>
                                    <td>{row.time}</td>
                                    <td>{row.x}</td>
                                    <td>{row.y}</td>
                                    <td>{row.z}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <button className="p-2 bg-slate-600">Import</button>
        </form>
    );
}
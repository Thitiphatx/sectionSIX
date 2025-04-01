"use client"

import { ImagesExport } from "@/app/viewer/[versionId]/page";
import { objectClasses } from "@/types/classes";
import { MenuItem } from "primereact/menuitem";
import { SplitButton } from "primereact/splitbutton"
import { Toast } from "primereact/toast";
import { useRef } from "react";


export default function ExportButton({ images }: { images: ImagesExport[] }) {
    const toast = useRef<Toast>(null);
    const items: MenuItem[] = [
        {
            label: '.csv',
            icon: 'pi pi-file-excel',
            command: () => {
                const csvContent = convertToCSV(images);
                downloadFile(csvContent, "csv");
                toast?.current?.show({ severity: 'success', summary: 'Exported', detail: 'The file is starting to download' });
            }
        },
        {
            label: '.kml',
            icon: 'pi pi-file',
            command: () => {
                const kmlContent = convertToKML(images);
                downloadFile(kmlContent, "kml");
                toast?.current?.show({ severity: 'success', summary: 'Exported', detail: 'The file is starting to download' });
            }
        },
    ]

    const convertToCSV = (data: ImagesExport[]) => {
        if (data.length === 0) return ""; // Handle empty data

        const transformedData = data.map(({ latitude, longitude, timestamp, classes }) => {
            const parsedClasses: number[] = Array.isArray(classes) ? classes : JSON.parse(classes?.toString() || "[]");
            return {
                latitude,
                longitude,
                timestamp,
                classes: parsedClasses.map((c) => objectClasses[c] || `Unknown(${c})`).join("|") // Convert array to readable string
            };
        });

        const headers = Object.keys(transformedData[0]).join(","); // Extract headers
        const rows = transformedData.map(row =>
            Object.values(row)
                .map(value => (typeof value === "object" ? JSON.stringify(value) : value)) // Ensure objects are stringified
                .join(",")
        );

        return [headers, ...rows].join("\n");
    };
    const convertToKML = (data: ImagesExport[]) => {
        if (data.length === 0) return ""; // Handle empty dataset

        const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
          <Document>
            <name>Exported Images</name>
        `;

        const kmlPlacemarks = data
            .map(({ latitude, longitude, timestamp, classes }) => {
                const parsedClasses: number[] = Array.isArray(classes) ? classes : JSON.parse(classes?.toString() || "[]");
                const classNames = parsedClasses.map((c) => objectClasses[c] || `Unknown(${c})`).join(" | ");

                return `
            <Placemark>
              <description>
                Timestamp: ${new Date(timestamp).toISOString()}
                Classes: ${classNames}
              </description>
              <Point>
                <coordinates>${longitude},${latitude},0</coordinates>
              </Point>
            </Placemark>`;
            })
            .join("\n");

        const kmlFooter = `
          </Document>
        </kml>`;

        return kmlHeader + kmlPlacemarks + kmlFooter;
    };

    const downloadFile = (content: string, fileType: "csv" | "kml") => {
        if (!content) {
            console.warn("No content to download.");
            return;
        }

        const fileName = `section6_data.${fileType}`;
        const mimeType = fileType === "csv" ? "text/csv" : "application/vnd.google-earth.kml+xml";
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    return (
        <div>
            <Toast ref={toast}></Toast>
            <SplitButton
                onClick={() => {
                    const csvContent = convertToCSV(images);
                    downloadFile(csvContent, "csv");
                    toast?.current?.show({ severity: 'success', summary: 'Exported', detail: 'The file is starting to download' });
                }}
                label="Export"
                icon="pi pi-download"
                className="p-button-outlined"
                model={items}
            />
        </div>
    )
}

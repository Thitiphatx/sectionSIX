"use client"

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { Images } from "@prisma/client";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useVersionContext } from "@/contexts/clusters/versionContext";
import { Button } from "primereact/button";
import { fileValidate } from "@/features/images/fileValidate";
import { useRouter } from "next/navigation";

export default function ImageTable() {
    const context = useVersionContext();
    const router = useRouter();
    const [images] = useState<Images[]>(context.Images);

    const statusBodyTemplate = (image: Images) => {
        let severity: null | "success" | "warning" | "secondary" | "info" | "danger" | "contrast";
        switch (image.status) {
            case "AVAILABLE":
                severity = "success";
                break;
            case "PENDING":
                severity = "warning";
                break;
        }
        return <Tag value={image.status} severity={severity}></Tag>;
    }

    const handleValidate = async ()=> {
        await fileValidate(context.cluster_id, context.id);
        router.refresh();
    }

    const header = () => {
        return (
            <div className="pt-5 px-5 flex flex-row justify-between">
                <h1 className="font-bold text-2xl">Resource image table</h1>
                <Button icon="pi pi-refresh" rounded outlined label="Validate image" onClick={handleValidate}/>
            </div>
        )
    }

    return (
        <Card header={header}>
            <DataTable value={images} removableSort size="small" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
                <Column sortable field="status" header="Status" body={statusBodyTemplate}></Column>
                <Column sortable field="file_name" header="File Name"></Column>
                <Column sortable field="latitude" header="Latitude"></Column>
                <Column sortable field="longitude" header="Longitude"></Column>
            </DataTable>
        </Card>
    )
}
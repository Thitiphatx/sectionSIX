"use client";

import { TransactionWithVersion } from "@/types/transaction";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";


export default function TransactionList({ data }: { data: TransactionWithVersion[] }) {
    const router = useRouter();
    const dateBody = (data: TransactionWithVersion) => {
        return (
            <p>{data.purchase_date.toLocaleDateString()}</p>
        );
    };

    const timeBody = (data: TransactionWithVersion) => {
        return (
            <p>{data.purchase_date.toLocaleTimeString()}</p>
        );
    };

    const versionBody = (data: TransactionWithVersion) => {
        return (
            <p>{data.version.version}</p>
        );
    };
    const priceBody = (data: TransactionWithVersion) => {
        return (
            <div className="flex flex-row gap-2 items-center">
                <p>฿{(data.price/100).toLocaleString()}</p>
            </div>
        );
    };
    const statusBody = (data: TransactionWithVersion) => {
        switch (data.status) {
            case "SUCCESS":
                return (
                    <Tag severity="success">Success</Tag>
                )
            case "CANCELED":
                return (
                    <Tag severity="danger">Canceled</Tag>
                )
        }
    };

    const viewBody = (data: TransactionWithVersion) => {
        
        return (
            <Button icon="pi pi-eye" text onClick={()=> router.push(`/viewer/${data.version_id}`)}/>
        )
    }
    
    return (
        <Card>
            <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                <Column body={dateBody} header="Date" />
                <Column body={timeBody} header="Time" />
                <Column body={priceBody} header="Price" />
                <Column body={versionBody} header="Version" />
                <Column body={statusBody} header="Status" />
                <Column body={viewBody} header="View" />
            </DataTable>
        </Card>
    );
}

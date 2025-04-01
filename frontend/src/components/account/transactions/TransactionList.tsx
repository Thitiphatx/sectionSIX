"use client";

import { FullTransaction } from "@/app/account/transactions/page";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";


export default function TransactionList({ data }: { data: FullTransaction[] }) {
    const router = useRouter();
    const dateBody = (data: FullTransaction) => {
        return (
            <p>{data.purchase_date.toLocaleDateString()}</p>
        );
    };

    const timeBody = (data: FullTransaction) => {
        return (
            <p>{data.purchase_date.toLocaleTimeString()}</p>
        );
    };

    const versionBody = (data: FullTransaction) => {
        return (
            <p>{data.version.version}</p>
        );
    };
    const priceBody = (data: FullTransaction) => {
        return (
            <div className="flex flex-row gap-2 items-center">
                <p>฿{(data.price/100).toLocaleString()}</p>
            </div>
        );
    };
    const statusBody = (data: FullTransaction) => {
        switch (data.status) {
            case "SUCCESS":
                return (
                    <Tag severity="success">Success</Tag>
                )
            case "FAILED":
                return (
                    <Tag severity="danger">Failed</Tag>
                )
        }
    };
    const addressBody = (data: FullTransaction) => {
        return (
            <div className="flex flex-row gap-2 items-center">
                <p>{data.version.cluster.address}</p>
            </div>
        );
    };
    const clusterBody = (data: FullTransaction) => {
        return (
            <div className="flex flex-row gap-2 items-center">
                <p>{data.version.cluster.road}</p>
            </div>
        );
    };
    const viewBody = (data: FullTransaction) => {
        return (
            <Button icon="pi pi-eye" text onClick={()=> router.push(`/viewer/${data.version_id}`)}/>
        )
    }
    
    return (
        <Card>
            <DataTable value={data} tableStyle={{ minWidth: '50rem' }} paginator rows={10} emptyMessage={"No transaction yet."}>
                <Column sortable body={dateBody} header="Date" />
                <Column sortable body={timeBody} header="Time" />
                <Column body={addressBody} header="Address" />
                <Column body={clusterBody} header="Cluster" />
                <Column body={versionBody} header="Version" />
                <Column sortable body={priceBody} header="Price" />
                <Column sortable body={statusBody} header="Status" />
                <Column body={viewBody} header="View" />
            </DataTable>
        </Card>
    );
}

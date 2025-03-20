"use client"

import { Resources } from "@prisma/client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag } from "primereact/tag";
import { DataView } from "primereact/dataview";
import Image from "next/image";
import { Button } from "primereact/button";
import { resourceStatusColor } from "@/features/resources/resource_status_color";
import { Card } from "primereact/card";
import { ResourceList } from "@/types/resources";

export default function ResourceListCard({ resources_list }: { resources_list: ResourceList[] }) {
    const router = useRouter();

    const itemTemplate = (data: ResourceList) => {
        return (
            <Link href={`/dashboard/resources/${data.id}`} key={data.id} className="h-fit">
                <Card className="rounded-xl"
                    pt={{
                        body: {
                            className: "py-0 p-0"
                        },
                        content: {
                            className: "p-3"
                        }
                    }}
                >
                    <div className="flex flex-row flex-nowrap gap-5">
                        <div className="w-24">
                            <Tag className="size-full" value={data.status} severity={resourceStatusColor(data.status)} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-extrabold text-lg">{data.name}</h3>
                            <div className="flex flex-row items-center gap-3 text-zinc-500">
                                <div className="flex flex-row items-center gap-1">
                                    <i className="pi pi-calendar text-sm"></i>
                                    <p>{data.created_at.toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                    <i className="pi pi-images text-sm"></i>
                                    <p className="text-sm">{data.Images.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        )
    }

    const listTemplate = (data: Resources[]) => {
        return (
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 p-2">
                {data.map((resource: Resources) => itemTemplate(resource))}
            </div>
        )

    };

    return (
        <div className="min-h-full">
            <DataView
                pt={{
                    content: {
                        className: "min-h-[calc(100vh-15rem)] p-2 text-center bg-zinc-100"
                    }
                }}
                value={resources_list}
                itemTemplate={itemTemplate}
                listTemplate={listTemplate}
                paginator
                rows={5}
                layout={"grid"}
                emptyMessage="No resources available. Upload or import a new resource to continue."
                header={<div className="flex justify-between items-center">
                    <h1>list of resources</h1>
                    <Button onClick={() => router.push("/dashboard/import")} icon="pi pi-plus" label="import resource" />
                </div>}
            />
        </div>
    )
}

"use client"

import { Card } from 'primereact/card';
import { ClusterWithVersionWithImage, VersionWithImage } from '@/app/dashboard/cluster/[clusterId]/page';
import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'primereact/tag';
import { ClusterVersionStatus } from '@prisma/client';
import { objectClasses } from '@/types/classes';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { useState } from 'react';
import { Button } from 'primereact/button';

export default function VersionList({ data, isDashboard }: { data: ClusterWithVersionWithImage, isDashboard: boolean }) {
    const [list, setList] = useState<VersionWithImage[]>(data.ClusterVersions)
    const [filters, setFilters] = useState<number[]>([]);

    const getAvailableClass = (strClasses: string | undefined): number[] => {
        if (!strClasses) {
            return []
        }
        return JSON.parse(strClasses);

    }

    const getStatusColor = (status: ClusterVersionStatus): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | null | undefined => {
        switch (status) {
            case 'ACTIVE': return "success";
            case 'DEACTIVE': return "danger";
            case 'UNPROCESS': return "warning";
        }
    };

    const applyFilter = () => {
        if (filters.length === 0) {
            setList(data.ClusterVersions); // Reset to full list if no filters are selected
            return;
        }

        const filteredData = data.ClusterVersions.filter(version => {
            // Ensure classes is parsed properly
            const classArray: number[] = version.classes ? JSON.parse(version.classes.toString()) : [];

            // Check if any selected filters exist in the classArray
            return classArray.some(classId => filters.includes(classId));
        });

        setList(filteredData);
    }

    return (
        <div className="space-y-2">
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
                    <MultiSelect
                        value={filters}
                        onChange={(e: MultiSelectChangeEvent) => setFilters(e.value)}
                        options={objectClasses.map((c, index) => ({ label: c, value: index }))}
                        filter
                        placeholder="Filter Classes"
                        className="w-full"
                    />
                    <Button
                        type="submit"
                        label="Apply"
                        icon="pi pi-check"
                        className="p-button-rounded p-button-primary"
                        onClick={applyFilter}
                    />
                </div>
            </Card>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <i className="pi pi-sitemap"></i>
                        Versions ({data.ClusterVersions.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.length > 0 ? (
                        list.map((item) => (
                            <Link key={item.id} href={isDashboard ? `/dashboard/cluster/${item.cluster_id}/${item.id}` : `/viewer/${item.id}`} className="block">
                                <div className="bg-white rounded-lg overflow-hidden h-fit ring-1 ring-zinc-300">
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            className="w-full h-full object-cover"
                                            alt={"Cluster thumbnail"}
                                            width={400}
                                            height={300}
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/preview/${item.cluster_id}/${item.id}`}
                                        />
                                        <div className="absolute top-0 right-0 m-2">
                                            <Tag
                                                value={item.status}
                                                severity={getStatusColor(item.status)}
                                                className="shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 h-full">
                                        <h1 className="font-extrabold">{data.road}</h1>
                                        <div className="flex flex-wrap gap-1 items-start mb-2">
                                            {getAvailableClass(item.classes?.toString()).map((c) => (
                                                <Tag key={c}>{objectClasses[c]}</Tag>))}
                                        </div>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                            <div className="text-gray-500 flex flex-row justify-between gap-2 w-full">
                                                <div className="flex flex-row items-center gap-2 text-xs">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <i className="pi pi-calendar text-sm"></i>
                                                        <p>{item.created_at.toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <i className="pi pi-images text-sm"></i>
                                                        <p className="text-sm">{item.Images.length}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    ฿{item.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                            <i className="pi pi-search text-4xl text-gray-400 mb-3"></i>
                            <p className="text-gray-500">No clusters found</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

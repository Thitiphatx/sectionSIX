"use client"
import { useClusterContext } from '@/contexts/clusters/clusterContext';
import React from 'react';
import VersionItem from '../version/version_item';

export default function VersionList() {
    const context = useClusterContext();

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="pi pi-sitemap"></i>
                    Versions ({context.ClusterVersions.length})
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {context.ClusterVersions.length > 0 ? (
                    context.ClusterVersions.map((item, index) => (
                        <VersionItem item={item} key={index} href={`/dashboard/cluster/${item.cluster_id}/${item.id}`} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                        <i className="pi pi-search text-4xl text-gray-400 mb-3"></i>
                        <p className="text-gray-500">No clusters found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

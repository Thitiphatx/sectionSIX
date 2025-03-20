"use client"

import { ClusterVersionStatus } from "@prisma/client"
import { objectClasses } from "@/types/classes";
import Image from "next/image"
import Link from "next/link"
import { Tag } from "primereact/tag"
import { useEffect, useState } from "react"
import { VersionWithAddress } from "@/types/version";

export default function VersionItem({ item, href }: { item: VersionWithAddress, href: string }) {
  const [availableClass, setAvailableClass] = useState<number[]>(() => {
    try {
      return item.classes ? JSON.parse(item.classes.toString()) : [];
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  });


  const getStatusColor = (status: ClusterVersionStatus): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | null | undefined => {
    switch (status) {
      case 'ACTIVE': return "success";
      case 'DEACTIVE': return "danger";
      case 'UNPROCESS': return "warning";
    }
  };

  return (
    <Link href={href} className="block transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 h-full">
        <div className="relative h-40 overflow-hidden">
          <Image
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            alt={"Cluster thumbnail"}
            width={400}
            height={300}
            src={`http:localhost:5000/preview/${item.cluster_id}/${item.id}`}
          />
          <div className="absolute top-0 right-0 m-2">
            <Tag
              value={item.status}
              severity={getStatusColor(item.status)}
              className="shadow-sm"
            />
          </div>
        </div>

        <div className="p-4">
          {/* <h1 className="font-extrabold">{item.cluster.address}</h1> */}
          <div className="flex flex-wrap gap-1 items-start mb-2">
            {availableClass.map((c) => (
              <Tag key={c}>{objectClasses[c]}</Tag>))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex flex-row items-center gap-2">
              <div className="flex flex-row items-center gap-1">
                <i className="pi pi-calendar text-sm"></i>
                <p>{item.created_at.toLocaleDateString()}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <i className="pi pi-images text-sm"></i>
                <p className="text-sm">{item.Images.length}</p>
              </div>

            </span>

            <span className="text-xs text-blue-600 flex items-center hover:underline">
              View details
              <i className="pi pi-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

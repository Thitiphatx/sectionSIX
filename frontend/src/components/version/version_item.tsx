"use client"

import { ClusterVersions, ClusterVersionStatus } from "@prisma/client"
import { objectClasses } from "@/types/classes";
import Image from "next/image"
import Link from "next/link"
import { Tag } from "primereact/tag"
import { useState } from "react"

export default function VersionItem({ item, href }: { item: ClusterVersions, href: string }) {
  const [availableClass, setAvailableClass] = useState<number[]>(JSON.parse(item.classes?.toString() ?? ""))

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
            src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
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
          <div className="flex flex-wrap gap-1 items-start mb-2">
              {availableClass.map((c)=> (
              <Tag key={c}>{objectClasses[c]}</Tag>))}
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center">
              <i className="pi pi-images mr-1"></i>
              {item.created_at.toDateString()}
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

"use client"
import { Clusters } from "@prisma/client";
import Image from "next/image";
import { Tag } from "primereact/tag";
import Link from "next/link";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ClusterGrid({ clusters, isLoading }: { clusters: Clusters[], isLoading: boolean }) {

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <ProgressSpinner />
            </div>
        )
    }
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="pi pi-sitemap"></i>
                    Clusters ({clusters.length})
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusters.length > 0 ? (
                    clusters.map((item, index) => (
                        <ClusterGridItem item={item} key={index} />
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

const ClusterGridItem = ({ item }: { item: Clusters }) => {
    return (
        <Link href={`/dashboard/cluster/${item.id}`} className="block transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 h-full">
                <div className="relative h-40 overflow-hidden">
                    <Image 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        alt={item.address || "Cluster thumbnail"} 
                        width={400} 
                        height={300} 
                        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" 
                    />
                    <div className="absolute top-0 right-0 m-2">
                        <Tag 
                            value="Segmented" 
                            severity="success" 
                            className="shadow-sm" 
                        />
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.address}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            3
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <i className="pi pi-map-marker text-sm"></i>
                        <p className="text-sm">{item.road ? `ถนน ${item.road}` : "Road not specified"}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 flex items-center">
                            <i className="pi pi-images mr-1"></i>
                            {/* {item.image_count || "0"} images */}
                        </span>
                        
                        <span className="text-xs text-blue-600 flex items-center hover:underline">
                            View details
                            <i className="pi pi-arrow-right ml-1"></i>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
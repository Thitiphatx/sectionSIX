"use client"
import { useVersionContext } from "@/contexts/version/versionContext";
import { objectClasses } from "@/types/classes";
import { Card } from "primereact/card"
import { MenuItem } from "primereact/menuitem";
import { SplitButton } from "primereact/splitbutton"
import { Tag } from "primereact/tag";
import { useState } from "react";

export default function VideoDescription() {
    const { data, address } = useVersionContext();
    const [foundObject, setFoundObject] = useState<number[]>(JSON.parse(data.classes?.toString() ?? ""));
    
    const items: MenuItem[] = [
        {
            label: 'csv',
            icon: 'pi pi-file',
            command: () => {
                // Export as CSV logic
            }
        },
        {
            label: 'kml',
            icon: 'pi pi-map',
            command: () => {
                // Export as KML logic
            }
        }
    ];

    
    // Format date properly
    const formattedDate = data.created_at instanceof Date 
        ? data.created_at.toLocaleDateString() 
        : new Date(data.created_at).toLocaleDateString();
    
    return (
        <Card className="shadow-md">
            <div className="space-y-3">
                <div>
                    <div className="flex flex-row gap-2 items-center">
                        <i className="pi pi-map-marker"></i>
                        <h2 className="text-xl font-bold line-clamp-1">{address}</h2>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-2">
                            <i className="pi pi-calendar mr-1"></i>
                            {formattedDate}
                        </span>
                        <span className="mr-2">
                            <i className="pi pi-tag mr-1"></i>
                            version {data.version}
                        </span>
                    </div>
                </div>
                
                <div className="border-t pt-3">
                    <div className="mb-2 text-sm text-gray-600">Classes:</div>
                    <div className="flex flex-wrap gap-2">
                        {foundObject.length > 0 ? (
                            foundObject.map((c, index) => (
                                <Tag key={index} value={objectClasses[c] || c} />
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No classes defined</span>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center">
                        
                    </div>
                    <SplitButton 
                        label="Export" 
                        icon="pi pi-download" 
                        className="p-button-outlined" 
                        model={items} 
                    />
                </div>
            </div>
        </Card>
    )
}
"use client"

import ResourceImageTable from "../clusters/image_table"
import ResourceImageUpload from "../clusters/image_upload_form"
import ResourceInfoPanel from "./resource_info_panel"
import { TabView, TabPanel } from "primereact/tabview"
import ResourceDeletePanel from "./resource_delete_panel"
import ResourceModelPanel from "./resource_model_panel"
import { ResourceContext } from "@/contexts/resources/context"
import { ResourceWithImage } from "@/types/resources"
import ResourceCluster from "../clusters/resource_cluster"

interface props {
    data: ResourceWithImage
}

export default function ResourceDashboard({ data }: props) {

    return (
        <ResourceContext.Provider value={data}>
            <TabView>
                <TabPanel header="settings">
                    <div className="space-y-5">
                        <ResourceInfoPanel />
                        <ResourceDeletePanel />
                    </div>
                </TabPanel>
                <TabPanel header="cluster extraction">
                    <div className="space-y-5">
                        <ResourceCluster />
                    </div>
                </TabPanel>
            </TabView>
        </ResourceContext.Provider>
    )
}

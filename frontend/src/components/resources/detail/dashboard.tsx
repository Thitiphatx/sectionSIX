"use client"
import { TabView, TabPanel } from "primereact/tabview"
import ResourceDeletePanel from "./delete"
import { ResourceContext } from "@/contexts/resources/context"
import { ResourceWithImage } from "@/types/resources"
import ResourceCluster from "./extraction"
import ResourceInfoPanel from "./settings"

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

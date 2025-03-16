"use client"

import { TabPanel, TabView } from "primereact/tabview";
import ClusterSettings from "./cluster_settings";
import { ClusterWithVersion } from "@/types/clusters";
import VersionList from "./version_list";
import { ClusterContext } from "@/contexts/clusters/clusterContext";

export default function ClusterDetail({ data }: { data: ClusterWithVersion }) {

    return (
        <ClusterContext.Provider value={data}>
            <TabView>
                <TabPanel header="settings">
                    <ClusterSettings />
                </TabPanel>
                <TabPanel header="versions">
                    <VersionList />
                </TabPanel>
            </TabView>
        </ClusterContext.Provider>

    );
}
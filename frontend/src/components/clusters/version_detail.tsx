"use client"

import { VersionContext } from "@/contexts/clusters/versionContext"
import { ClusterWithImage } from "@/types/clusters"
import { TabPanel, TabView } from "primereact/tabview"
import VersionSettings from "./version_settings"
import ImageUploadForm from "./image_upload_form"
import ImageTable from "./image_table"
import SegmentCard from "./segment_card"

export default function VersionDetail({ data }: { data: ClusterWithImage }) {
    return (
        <VersionContext.Provider value={data}>
            <TabView>
                <TabPanel header="settings">
                    <VersionSettings />
                </TabPanel>
                <TabPanel header="images">
                    <ImageUploadForm />
                    <ImageTable />
                </TabPanel>
                <TabPanel header="segmentation">
                    <SegmentCard />
                </TabPanel>
            </TabView>
        </VersionContext.Provider>

    )
}

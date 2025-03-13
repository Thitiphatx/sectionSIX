"use client"

import { Clusters } from "@prisma/client"
import { SegmentContext } from "../utils/context"
import SegmentList from "./segment_list"

export default function SegmentDashboard() {
    return (
        <SegmentContext.Provider value={[]}>
            <SegmentList />
        </SegmentContext.Provider>
    )
}

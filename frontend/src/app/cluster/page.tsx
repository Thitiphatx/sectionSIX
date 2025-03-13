"use client"

import ErrorPage from "@/components/error"

export default function page() {
    return (
        <ErrorPage message="page not found" suggestion="cluster id must be provided" />
    )
}

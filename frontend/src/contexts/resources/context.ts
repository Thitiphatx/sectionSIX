"use client"
import { createContext, useContext } from "react";
import { ResourceWithImage } from "../../types/resources";

export const ResourceContext = createContext<ResourceWithImage | undefined>(undefined);

export function useResourceContext(): ResourceWithImage {
    const data: ResourceWithImage = useContext(ResourceContext);

    if (!data) {
        throw new Error("useResourceContext must be use with ResourceContext");
    }
    return data;
}

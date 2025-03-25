"use client"

import { objectClasses } from "@/types/classes"
import { MultiSelect } from "primereact/multiselect"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export interface Filter {
    label: string;
    value: number;
}

export default function BrowseFilter({ setSelectedFilters, selectedFilters }: { setSelectedFilters: Dispatch<SetStateAction<number[]>>, selectedFilters: number[] }) {
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<Filter[]>([])

    useEffect(() => {
        const newOptions = objectClasses.map((cl, index) => ({
            label: cl,
            value: index
        }))
        setOptions(newOptions)
        setLoading(false);
    }, [])

    return (
        <div>
            <label>
                Filter by class
                <div className="p-inputgroup flex-1">
                    <MultiSelect value={selectedFilters} onChange={(e) => setSelectedFilters(e.value)} options={options}
                        optionLabel="label"
                        optionValue="value"
                        loading={loading}
                        filter
                        placeholder="Select Classes"
                        className="max-w-md w-full" />
                </div>
            </label>

        </div>
    )
}

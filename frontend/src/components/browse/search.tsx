"use client"
import { Button } from "primereact/button"
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext"
import { useState } from "react"

export default function BrowseSearch({ onSearch, defaultQuery = "", }: { onSearch: (query: string) => void, defaultQuery: string }) {
    const [query, setQuery] = useState(defaultQuery);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onSearch(query);
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                <IconField iconPosition="left" pt={{ root: { className: "flex-1" } }}>
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full" />
                </IconField>
                <Button
                    type="submit"
                    label="Search"
                    icon="pi pi-search"
                    className="p-button-rounded p-button-primary"
                />
            </div>
        </form>
    )
}

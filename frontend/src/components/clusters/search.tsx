"use client"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useState } from "react"

export default function ClusterSearch({ onSearch, defaultQuery = "", }: { onSearch: (query: string) => void, defaultQuery: string }) {
    const [query, setQuery] = useState(defaultQuery);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onSearch(query);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-inputgroup flex-1">
                <InputText
                    placeholder="type in road..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
        </form>
    )
}

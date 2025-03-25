"use client"

import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

export default function SearchBar() {
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const query = formData.get("query") as string;

        if (!query.trim()) return;

        router.push(`/browse?s=${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                <IconField iconPosition="left" pt={{ root: { className: "flex-1" } }}>
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText name="query" placeholder="Search" className="w-full" />
                </IconField>
                <Button
                    type="submit"
                    label="Search"
                    icon="pi pi-search"
                    className="p-button-rounded p-button-primary"
                />
            </div>
        </form>
    );
}

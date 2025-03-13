"use client"

import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

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
        <div className="flex flex-col justify-center items-center space-y-5 w-full h-96" style={{ backgroundColor: 'var(--highlight-bg)'}}>
            <h1 className="font-bold text-5xl">Section 6</h1>
            <form className="w-[800px]" onSubmit={handleSearch}>
                <div className="p-inputgroup w-full">
                    <InputText name="query" placeholder="Search" />
                    <Button icon="pi pi-search" type="submit" />
                </div>
            </form>
        </div>
    );
}

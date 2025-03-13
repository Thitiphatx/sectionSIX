"use client"

import { Users } from "@prisma/client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { Badge } from "primereact/badge";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/usersContext";

export default function UserTable() {
    const data = useUserContext();
    const [users] = useState<Users[]>(data);
    const { data: session } = useSession();
    const router = useRouter();

    const roleBodyTemplate = (user: Users) => {
        let severity: null | "success" | "warning" | "secondary" | "info" | "danger" | "contrast";
        switch (user.role) {
            case "ADMIN":
                return (
                    <div>
                        <i className="pi pi-crown p-primary" style={{ fontSize: '1rem', color: "var(--primary-color)" }}></i>
                    </div>
                )
            case "USER":
                return (
                    <div>
                        <i className="pi pi-user" style={{ fontSize: '1rem' }}></i>
                    </div>
                )
        }
    }

    const manageBodyTemplate = (user: Users) => {
        const [copyTooltips, setCopyTooltips] = useState("copy user id");
        const copyToClip = async ()=> {
            await navigator.clipboard.writeText(user.id)
            setCopyTooltips("copied");
            setTimeout(()=> {
                setCopyTooltips("copy user id");
            }, 3000);
        }
        return (
            <div className="space-x-1">
                {(session?.user.id === user.id) ? (<></>) :
                    (
                        <Button size="small" severity="info" icon="pi pi-pen-to-square" onClick={()=> router.push(`/dashboard/users/${user.id}`)} />
                    )}
                <Button size="small" severity="secondary" icon="pi pi-clone" tooltip={copyTooltips} onClick={copyToClip}/>
            </div >

        )
    }

    const nameBodyTemplate = (user: Users) => {
        return (
            <p className="flex flex-row gap-2">
                {user.name}
                {session?.user.id === user.id && (<Badge value="you"></Badge>)}
            </p>
        )
    }

    return (
        <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
            <Column field="role" header="role" body={roleBodyTemplate}></Column>
            <Column field="name" header="name" body={nameBodyTemplate}></Column>
            <Column field="email" header="email"></Column>
            <Column field="id" header="" body={manageBodyTemplate}></Column>
        </DataTable>
    )
}

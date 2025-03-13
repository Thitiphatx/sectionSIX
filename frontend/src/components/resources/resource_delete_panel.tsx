"use client"

import { useResourceContext } from "@/contexts/resources/context"
import { DeleteResource } from "@/features/resources/delete_resource"
import { useRouter } from "next/navigation"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"
import { Toast } from "primereact/toast"
import { useRef } from "react"

export default function ResourceDeletePanel() {
    const router = useRouter();
    const data = useResourceContext();
    const toast = useRef<Toast>(null);
    const accept = async () => {

        try {
            await DeleteResource(data.id);
            toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            router.push("/dashboard/resources")
        } catch (error) {

        }
    }

    const confirm = () => {
        confirmDialog({
            message: 'Do you want to delete this resource? Segmented image will still exist.',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept
        });
    };
    return (
        <Card>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button severity="danger" outlined onClick={confirm} icon="pi pi-times" label="Delete"></Button>
            </div>
        </Card>
    )
}

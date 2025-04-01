"use client"

import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button";
import { useProfileContext } from "@/contexts/profileContext";
import { handleSaveInfo } from "@/features/profile/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { profileSchema } from "@/libs/zod/zod";
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function ProfileInfoPanel() {
    const { data: session, update } = useSession();
    const toast = useRef<Toast>(null);
    const data = useProfileContext();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            email: data.email,
        }
    })

    const onSubmit = async (values: z.infer<typeof profileSchema>) => {
        try {
            // Make sure this function is implemented properly to handle the signin logic
            const result = await handleSaveInfo(values);
            
            // Handle successful sign in or redirect here
            if (result?.message) {
                setError("root", {
                    message: result.message
                });
                return;
            }

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: values.name,
                    email: values.email
                }
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully!',
                life: 3000
            });
        } catch (error) {
            console.log(error);
            // If error occurs, set the global error message to display
            setError("root", {
                message: "error"
            })
        }
    }

    return (
        <Card title="Profile">
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <input {...register("id")} defaultValue={data.id} className="hidden" />
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">Email</label>
                    <InputText type="email" {...register("email")} />
                    {errors.email && <small className="p-error text-sm">{errors.email.message}</small>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">Name</label>
                    <InputText {...register("name")} />
                    {errors.name && <small className="p-error text-sm">{errors.name.message}</small>}
                </div>
                {errors.root && <small className="p-error text-sm">{errors.root.message}</small>}
                <Button label="Save" icon="pi pi-check" iconPos="right" size="small" loading={isSubmitting} />
            </form>

            <small>created since {data.created_at.toDateString()}</small>
        </Card>
    )
}

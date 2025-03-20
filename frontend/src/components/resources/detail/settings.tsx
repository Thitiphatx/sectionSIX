"use client"
import { useState } from "react";
import { Card } from "primereact/card"
import { Resources } from "@prisma/client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useResourceContext } from "@/contexts/resources/context";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { resourceSchema } from "@/libs/zod/resource";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { update_resource } from "@/features/resources/update_resource";

export default function ResourceInfoPanel() {
    const data: Resources = useResourceContext();
    const [resourceName, setResourceName] = useState(data.name);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<z.infer<typeof resourceSchema>>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            id: data.id,
            name: resourceName
        }
    })

    const onSubmit = async (values: z.infer<typeof resourceSchema>) => {
        setLoading(true);
        try {
            // Make sure this function is implemented properly to handle the signin logic
            const result = await update_resource(values);

            // Handle successful sign in or redirect here
            
            setError("root", {
                message: result?.message
            });
        } catch (error: any) {
            // If error occurs, set the global error message to display
            setError("root", {
                message: "error"
            })
        }
        toast.current?.show({
            severity: 'success',
            summary: 'Resource Updated',
            detail: `Resource name updated to "${resourceName}"`,
            life: 3000
        });
        setIsEditing(false);
        setLoading(false);
    }

    const header = (
        <div className="flex items-center gap-2 mb-2 p-5">
            <i className="pi pi-folder text-2xl"></i>
            <h2 className="text-xl font-medium m-0">Resource Details</h2>
        </div>
    );

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <>
            <Toast ref={toast} />
            <Card header={header}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="resource_name" className="font-medium text-gray-700 block mb-2">
                            Resource Name
                        </label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="pi pi-tag text-gray-400"></i>
                            </div>
                            <InputText
                                id="resource_name"
                                {...register("name")}
                                className="w-full pl-10"
                                invalid={errors.name ? true : false}
                                disabled={!isEditing || loading}
                            />
                            {errors.name && <small className="p-error text-sm">{errors.name.message}</small>}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600">
                            <i className="pi pi-calendar"></i>
                            <span className="font-medium">Created</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 ml-6">
                            {formatDate(data.created_at)}
                        </p>
                    </div>
                    {errors.root && <small className="p-error text-sm">{errors.root.message}</small>}
                    <Divider className="my-4" />

                    <div className="flex justify-between items-center pt-2">
                        {!isEditing ? (
                            <Button
                                type="button"
                                label="Edit Details"
                                icon="pi pi-pencil"
                                className="p-button-outlined p-button-sm"
                                onClick={() => setIsEditing(true)}
                            />
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    label="Cancel"
                                    icon="pi pi-times"
                                    className="p-button-outlined p-button-sm p-button-secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setResourceName(data.name);
                                    }}
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    label="Save Changes"
                                    icon="pi pi-check"
                                    loading={loading}
                                />
                            </div>
                        )}

                    </div>
                </form>
            </Card>
        </>
    );
}
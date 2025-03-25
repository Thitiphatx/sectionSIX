"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Users } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { editUserSchema } from '@/libs/zod/editUser';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import editUser from '@/features/dashboard/editUser';
import { useSession } from 'next-auth/react';

// Define dropdown option type
interface DropdownOption {
    label: string;
    value: string;
}

const userRoles: DropdownOption[] = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' }
];

const userStatuses: DropdownOption[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Deactive (Banned)', value: 'DEACTIVE' }
];

interface EditUserPageProps {
    data: Users;
}

export default function EditUserPage({ data }: EditUserPageProps) {
    const router = useRouter();
    const toast = useRef<Toast | null>(null);
    const { data: session } = useSession();

    // React Hook Form
    const { register, handleSubmit, setError, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof editUserSchema>>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status
        }
    });

    const onSubmit = async (values: z.infer<typeof editUserSchema>) => {
        try {
            const submitData = {
                ...values,
                adminId: session?.user.id as string
            };

            const result = await editUser(submitData);

            if (result?.message) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
                setError("root", { message: result.message });
            } else {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'User updated successfully', life: 3000 });
                router.refresh();
            }
        } catch (error) {
            setError("root", { message: "An error occurred while updating the user." });
        }
    };

    return (
        <div>
            <Toast ref={toast} />

            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit user</h1>
                <Button
                    label="Back to Users"
                    icon="pi pi-arrow-left"
                    className="p-button-outlined"
                    onClick={() => router.back()}
                />
            </div>

            <Card>
                <form className="p-fluid" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="field">
                            <label htmlFor="name" className="font-medium mb-2 block">Name</label>
                            <InputText {...register("name")} />
                            {errors.name && <small className="p-error text-sm">{errors.name.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email" className="font-medium mb-2 block">Email</label>
                            <InputText {...register("email")} />
                            {errors.email && <small className="p-error text-sm">{errors.email.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="role" className="font-medium mb-2 block">Role</label>
                            <Dropdown
                                options={userRoles}
                                value={watch("role")} // Observe current role value
                                onChange={(e: DropdownChangeEvent) => setValue("role", e.value)} // Update form state
                            />
                            {errors.role && <small className="p-error text-sm">{errors.role.message}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="status" className="font-medium mb-2 block">Status</label>
                            <Dropdown
                                options={userStatuses}
                                value={watch("status")}
                                onChange={(e: DropdownChangeEvent) => setValue("status", e.value)}
                            />
                            {errors.status && <small className="p-error text-sm">{errors.status.message}</small>}
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 gap-2">
                        <Button
                            type="button"
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => router.back()}
                        />
                        <Button
                            type="submit"
                            label="Save Changes"
                            icon="pi pi-save"
                            loading={isSubmitting}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}

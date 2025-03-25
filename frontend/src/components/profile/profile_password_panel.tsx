"use client"

import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Password } from "primereact/password"
import { Message } from "primereact/message"
import { useProfileContext } from "@/contexts/profileContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"
import { passwordSchema } from "@/libs/zod/zod"
import { handleSavePassword } from "@/features/profile/action"

export default function ProfilePasswordPanel() {
    const data = useProfileContext();
    
    const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            id: data.id,
            currentPassword: "",
            password: "",
            confirmPassword: ""
        }
    });

    // Ensure id updates dynamically if it changes
    useEffect(() => {
        reset({ id: data.id });
    }, [data.id, reset]);

    const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
        try {
            const result = await handleSavePassword(values);
            
            if (result?.message !== "Password updated successfully") {
                setError("root", { message: result?.message || "Unknown error" });
            }
        } catch (error) {
            setError("root", { message: "An unexpected error occurred." });
        }
    };

    return (
        <Card title="Password">
            {/* <Message severity="warn" text="You need to re-login after changing the password." /> */}
            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("id")} className="hidden" />
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="currentPass">Current password</label>
                    <input className="p-inputtext text-xs" type="password" {...register("currentPassword")} />
                    {errors.currentPassword && <small className="p-error text-sm">{errors.currentPassword.message}</small>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="newPass">New password</label>
                    <input className="p-inputtext text-xs" type="password" {...register("password")}  />
                    {errors.password && <small className="p-error text-sm">{errors.password.message}</small>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPass">Password confirmation</label>
                    <input className="p-inputtext text-xs" type="password" {...register("confirmPassword")}/>
                    {errors.confirmPassword && <small className="p-error text-sm">{errors.confirmPassword.message}</small>}
                </div>

                {errors.root && <small className="p-error text-sm">{errors.root.message}</small>}

                <Button label="Submit" icon="pi pi-check" iconPos="right" disabled={isSubmitting} />
            </form>
        </Card>
    )
}

"use client"

import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/libs/zod/zod"
import { z } from "zod"
import { handleSignup } from "../utils/actions"

export default function SignupForm() {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        try {
            // Make sure this function is implemented properly to handle the signin logic
            const result = await handleSignup(values);

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
    }

    return (
        <div className="mx-auto max-w-screen-lg w-full rounded-xl shadow-md bg-white">
            <div className="grid grid-cols-3">
                <div className="flex items-center justify-center col-span-2 pl-5 py-5">
                    <div className="p-4 shadow-2 rounded w-full">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
                                <span className="text-600 font-medium line-height-3">Already have an account?</span>
                                <Link className="font-medium no-underline ml-2 cursor-pointer" style={{ color: "var(--primary-color)" }} href="/authorize/signin">Sign in</Link>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                                    <InputText
                                        {...register("name")}
                                        type="text"
                                        placeholder="Display name"
                                        className="w-full"
                                        invalid={errors.name ? true : false}
                                    />
                                    {errors.name && <small className="p-error text-sm">{errors.name.message}</small>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                                    <InputText
                                        {...register("email")}
                                        type="text"
                                        placeholder="Email address"
                                        className="w-full"
                                        invalid={errors.email ? true : false}
                                    />
                                    {errors.email && <small className="p-error text-sm">{errors.email.message}</small>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                                    <InputText
                                        {...register("password")}
                                        type="password"
                                        placeholder="Password"
                                        className="w-full"
                                        invalid={errors.password ? true : false}
                                    />
                                    {errors.password && <small className="p-error text-sm">{errors.password.message}</small>}
                                </div>

                                {/* Display global error message */}
                                {errors.root && <small className="p-error text-sm">{errors.root.message}</small>}

                                <Button
                                    type="submit"
                                    label="Sign Up"
                                    icon="pi pi-user"
                                    className="w-full"
                                    loading={isSubmitting}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="h-full relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-5 before:rounded-r-xl before:bg-white">
                    <div className="w-full h-full rounded-r-xl" style={{ backgroundColor: "var(--primary-color)"}}>
                    </div>
                </div>
            </div>
        </div>
    )
}

"use server"

import prisma from "../../../libs/prisma"
import { SigninFormSchema, SignupFormSchema } from "./schema"
import { hashSync } from "bcryptjs"
import { signIn, signOut } from "@/libs/auth"
import { AuthError } from "next-auth"
import { redirect, RedirectType } from "next/navigation"


interface credentialsProp {
    email: string,
    password: string
}

interface signUpCredentialsProp extends credentialsProp {
    name: string
}

export async function handleCredentialsSignin({ email, password }: credentialsProp) {
    try {
        await signIn("credentials", { email, password, redirect: false },);
        redirect("/", RedirectType.push);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: "Invalid credentials"
                    }
                default:
                    return {
                        message: "Something went wrong"
                    }
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut();
}

export async function handleSignup({ name, email, password }: signUpCredentialsProp) {
    const validationResult = SignupFormSchema.safeParse({ name, email, password });
    if (!validationResult.success) {
        return {
            message: "Invalid credentials"
        }
    }

    try {
        const existingUser = await prisma.users.findFirst({ where: { email } })
        if (existingUser) {
            return {
                message: "This email is already in use"
            }
        }
    } catch (error) {
        return {
            message: "Database is offline"
        }
    }

    const hashed = await hashSync(password, 10);
    try {
        await prisma.users.create({
            data: {
                name,
                email,
                password: hashed,
                created_at: new Date()
            }
        })
    } catch (error) {
        return {
            message: "Database is offline"
        }
    }

    
    try {
        await signIn("credentials", { email, password, redirectTo: "/" },);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: "Invalid credentials"
                    }
                default:
                    return {
                        message: "Something went wrong"
                    }
            }
        }
        throw error;
    }
}

export async function SignUpAction(prevState: any, formData: FormData) {
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    }
    const validationResult = SignupFormSchema.safeParse({
        name: data.name,
        email: data.email,
        password: data.password
    })

    if (!validationResult.success) {
        return {
            ...prevState,
            data,
            errors: validationResult.error.flatten().fieldErrors,
            success: false
        }
    }
    const email = formData.get("email") as string;
    let existingUser;
    try {
        existingUser = await prisma.users.findFirst({
            where: {
                email: email
            }
        })
    } catch (error) {
        console.log(error);
    }

    if (existingUser) {
        return {
            ...prevState,
            data,
            errors: {
                email: ["This email is already in use."],
            },
        };
    };

    const name = formData.get("name") as string;
    const rawPassword = formData.get("password") as string;

    const password = await hashSync(rawPassword, 10);
    await prisma.users.create({
        data: {
            name,
            email,
            password,
            created_at: new Date()
        }
    })

    return {
        ...prevState,
        data,
        errors: null,
        message: null,
        success: true
    }
}

export async function SignInAction(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    }
    const validationResult = SigninFormSchema.safeParse({
        email: data.email,
        password: data.password
    })

    if (!validationResult.success) {
        return {
            ...prevState,
            data,
            errors: validationResult.error.flatten().fieldErrors
        }
    }
    return {
        ...prevState,
        errors: null,
        data,
        message: null,
        success: true
    }
}
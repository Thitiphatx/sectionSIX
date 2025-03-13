import { z } from "zod"

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Name must be at least 4 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim(),
});

export const SigninFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password field must not be empty.' }),
});
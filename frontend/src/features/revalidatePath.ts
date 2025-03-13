"use server"

import { revalidatePath } from "next/cache"

export async function revalidate_path(path: string) {
    revalidatePath(path);
}
"use server"

import { promises as fs } from "fs";

export async function path_verify(path: string) {
    try {
        await fs.mkdir(path, { recursive: true });
        return true;
    } catch (error) {
        console.error(`Error creating path`);
        return false;
    }
}

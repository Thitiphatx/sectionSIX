"use server";
import fs from 'fs/promises';
import path from 'path';
export async function uploadImage(resourceId: string, formData: FormData) {
    const resourcePath = path.join("resources", `${resourceId}`);
    const uploadFolder = path.join(process.cwd(), "..", resourcePath);

    try {
        // Ensure the directory exists
        await fs.mkdir(uploadFolder, { recursive: true });

        // Iterate over formData entries to handle files
        for (const [key, value] of formData.entries()) {
            console.log(key)
            if (value instanceof File) {
                const buffer = Buffer.from(await value.arrayBuffer());
                const filename = value.name.replace(/\s+/g, "_");  // Use regex for replacing spaces
                const savePath = path.join(uploadFolder, filename);

                // Write the file to the directory
                await fs.writeFile(savePath, buffer);
            }
        }
    } catch (e) {
        console.error("Error uploading image:", e);
    }
}
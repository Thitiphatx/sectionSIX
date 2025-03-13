"use server"

import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const importImage = async (prevState: unknown, formData: FormData) => {
    // form validation

    // data info
    const data_info = formData.get("data_info")

    if (data_info instanceof File) {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const text = event.target?.result as string;
            const rows = text.trim().split("\n");
            const data = rows.slice(1).map((line) => {
                const [
                    id,
                    image,
                    time,
                    x,
                    y,
                    z,
                ] = line.split(",");
                return { id, image, time, x, y, z };
            });
            console.log(data)
        };
        reader.readAsText(data_info);
    }
    // const rows = data_info.trim().split("\n");
    // const data = rows.slice(1).map((line: string) => {
    //     const [
    //         id,
    //         image,
    //         time,
    //         x,
    //         y,
    //         z,
    //     ] = line.split(",");
    //     return { id, image, time, x, y, z };
    // });


    // Images
    const folderName = new Date().toISOString().replace(/[:.]/g, "-");
    const uploadFolder = path.join(process.cwd(), "resources", folderName);

    const files = formData.getAll("images")
    try {
        // making directory
        // await mkdir(uploadFolder, { recursive: true });

        // for (const file of files) {
        //     if (file instanceof File) {
        //         const buffer = Buffer.from(await file.arrayBuffer());
        //         const filename = file.name.replaceAll(" ", "_");
        //         const savePath = path.join(uploadFolder, filename);
                
        //         // write the file to the directory 
        //         await writeFile(savePath, buffer);
        //     }
        // }

        return { message: "success" }
    } catch (error) {
        return { message: "failed" }
    }
}
"use server"

import prisma from "@/libs/prisma";
import { create_image_data, ImageData } from "./create_image_data";

export interface ImportResource {
    name: string;
    created_at: Date;
    Images: ImageData[];
}

export const import_resource = async (resource: ImportResource)=> {
    try {
        const new_resource = await prisma.resources.create({
            data: {
                name: resource.name,
                created_at: new Date(),
            }
        })

        await create_image_data(new_resource.id, resource.Images);
        return new_resource.id
    } catch (error) {
        console.log(error);
        throw new Error("Database is offline");
    }

    
}
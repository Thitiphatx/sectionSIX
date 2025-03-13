"use server"

import prisma from "@/libs/prisma";

export interface ImageData {
    file_name: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
}

export async function create_image_data(resource_id: string, image_data: ImageData[]) {
    try {
        await prisma.images.createMany({
            data: image_data.map((image) => ({
                resource_id: resource_id,
                file_name: image.file_name,
                latitude: image.latitude,
                longitude: image.longitude,
                timestamp: image.timestamp,
            }))
        })
    } catch (error) {
        console.log("create image failed");
    }
} 
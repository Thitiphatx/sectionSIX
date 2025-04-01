"use server"

import prisma from "@/libs/prisma"
import path from "path"
import fs from 'fs';
import { ImageStatus } from "@prisma/client";

export async function fileValidate(clusterId: string, versionId: string) {
    try {
        const images = await prisma.images.findMany({
            where: {
                version_id: versionId
            },
            select: {
                id: true,
                file_name: true,
                status: true
            }
        })

        const updates = [];

        for (const image of images) {
            const imagePath = path.join(process.cwd(), '../storage/clusters', clusterId, 'versions', versionId, 'images', image.file_name);
            console.log(imagePath);

            const status: ImageStatus = (fs.existsSync(imagePath)) ? "AVAILABLE" : "PENDING";
            if (image.status !== status) {
                updates.push(prisma.images.update({
                    where: { id: image.id },
                    data: { status }
                }))
            }
        }

        if (updates.length > 0) {
            await prisma.$transaction(updates);
        }
    } catch (error) {
        console.log(error);
    }
}
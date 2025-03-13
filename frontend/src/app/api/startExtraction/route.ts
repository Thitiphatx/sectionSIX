import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { Clusters, Images } from "@prisma/client";

// https://nominatim.openstreetmap.org/reverse?lat=51.5074&lon=-0.1278&format=json

interface AddressData {
    place_id: number,
    licence: string,
    osm_type: string,
    osm_id: number,
    lat: string,
    lon: string,
    class: string,
    type: string,
    place_rank: number,
    importance: number,
    addresstype: string,
    name: string,
    display_name: string,
    address: Address,
    boundingbox: string[]
}

interface Address {
    road: string,
    quarter: string,
    suburb: string,
    city: string,
    postcode: string,
    country: string,
    country_code: string
}

interface ImageWithAddress {
    image: Images
    address: string;
    road: string;
}

type ProgressStore = {
    [processId: string]: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(req: NextRequest) {
    const resourceId = req.nextUrl.searchParams.get("resourceId")

    if (!resourceId) {
        return NextResponse.json({ message: "No resource id provided", status: 400 });
    }

    // 1. get resource with image
    const resource = await prisma.resources.findFirst({
        where: { id: resourceId },
        include: { Images: true }
    })

    if (!resource) {
        return NextResponse.json({ message: "No resource available", status: 400 });
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            let progress = 0;

            // 2. Prepare variable 
            const uniqueRoads = new Set<string>();
            const grouped: Record<string, ImageWithAddress[]> = {};

            // 3. Convert lat & lon to address and grouping
            for (const image of resource.Images) {
                console.log(image.file_name, "processing");
                const result: AddressData = await reverse_geocode(image.latitude, image.longitude);
                if (!result) continue;

                progress += 1;

                if (uniqueRoads.has(result.address.road)) {
                    if (!grouped[result.address.road]) {
                        grouped[result.address.road] = [];
                    }
                } else {
                    uniqueRoads.add(result.address.road);
                    grouped[result.address.road] = [];
                }

                grouped[result.address.road].push({
                    image: image,
                    address: result.display_name,
                    road: result.address.road
                });
                const data = `data: ${JSON.stringify({ progress })}\n\n`
                controller.enqueue(encoder.encode(data));
                await delay(1000); // Prevent API blocking
            }

            for (const road of uniqueRoads) {
                const cluster = await getCluster(road, grouped[road][0].address);
                const version = await getClusterVersion(cluster.id);
        
                // Update images to associate them with the correct cluster version
                const clusterImages = grouped[road].map(images => ({
                    version_id: version.id,  // Set the cluster version for the image
                    image_id: images.image.id
                }));
        
                if (clusterImages.length > 0) {
                    // Update images with the new cluster version ID
                    await prisma.images.updateMany({
                        where: {
                            id: {
                                in: clusterImages.map(ci => ci.image_id),
                            },
                        },
                        data: {
                            version_id: version.id,  // Update the version_id field in the Images table
                        },
                    });
                }
            }
            
            await prisma.resources.update({
                where: { id: resourceId },
                data: { status: "DONE" }
            })

            controller.close();
        },
    });

    return new Response(readableStream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}

const reverse_geocode = async (lat: number, lon: number) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null
    }
}

const getCluster = async (road: string, address: string): Promise<Clusters> => {
    let cluster = await prisma.clusters.findFirst({
        where: { road },
    })

    if (!cluster) {
        cluster = await prisma.clusters.create({
            data: {
                name: road,
                road: road,
                address: address
            },
        })
    }
    return cluster
}

const getClusterVersion = async (clusterId: string) => {
    const versions = await prisma.clusterVersions.findMany({
        where: { cluster_id: clusterId }
    })

    let newVersion;
    if (versions.length === 0) {
        newVersion = await prisma.clusterVersions.create({
            data: {
                cluster_id: clusterId,
                price: 99999,
                price_per_class: 0,
                version: 1
            }
        })
    } else {
        let newVersionNum = Math.max(...versions.map(v => v.version)) + 1;
        newVersion = await prisma.clusterVersions.create({
            data: {
                cluster_id: clusterId,
                price: 99999,
                price_per_class: 0,
                version: newVersionNum
            }
        })
    }
    return newVersion;
}
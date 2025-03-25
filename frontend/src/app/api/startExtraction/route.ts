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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(req: NextRequest) {
    const resourceId = req.nextUrl.searchParams.get("resourceId")

    if (!resourceId) {
        return NextResponse.json({ message: "No resource id provided", status: 400 });
    }

    const resource = await prisma.resources.findFirst({
        where: { id: resourceId },
        include: { Images: true }
    });

    if (!resource) {
        return NextResponse.json({ message: "No resource available", status: 400 });
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            let progress = 0;
            let lastAddressData: AddressData | null = null;

            const uniqueRoads = new Set<string>();
            const grouped: Record<string, ImageWithAddress[]> = {};

            for (let i = 0; i < resource.Images.length; i++) {
                const image = resource.Images[i];
                console.log(image.file_name, "processing");

                let result: AddressData | null = null;

                // Fetch new geocode data every 100 images
                if (i % 100 === 0 || !lastAddressData) {
                    result = await reverse_geocode(image.latitude, image.longitude);
                    lastAddressData = result;
                    console.log("Fetching new reverse geocode data...");
                    await delay(1000); // Reduce delay slightly for better performance
                } else {
                    result = lastAddressData;
                    console.log("Using cached reverse geocode data...");
                }

                if (!result) continue;

                progress += 1;

                if (!uniqueRoads.has(result.address.road)) {
                    uniqueRoads.add(result.address.road);
                    grouped[result.address.road] = [];
                }

                grouped[result.address.road].push({
                    image: image,
                    address: result.display_name,
                    road: result.address.road
                });

                const data = `data: ${JSON.stringify({ progress })}\n\n`;
                controller.enqueue(encoder.encode(data));
            }

            for (const road of uniqueRoads) {
                const cluster = await getCluster(road, grouped[road][0].address);
                const version = await getClusterVersion(cluster.id);

                const clusterImages = grouped[road].map(images => ({
                    version_id: version.id,
                    image_id: images.image.id
                }));

                if (clusterImages.length > 0) {
                    await prisma.images.updateMany({
                        where: {
                            id: {
                                in: clusterImages.map(ci => ci.image_id),
                            },
                        },
                        data: {
                            version_id: version.id,
                        },
                    });
                }
            }

            await prisma.resources.update({
                where: { id: resourceId },
                data: { status: "DONE" }
            });

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
        return null;
    }
}

const getCluster = async (road: string, address: string): Promise<Clusters> => {
    let cluster = await prisma.clusters.findFirst({
        where: { road },
    });

    if (!cluster) {
        cluster = await prisma.clusters.create({
            data: {
                name: road,
                road: road,
                address: address
            },
        });
    }
    return cluster;
}

const getClusterVersion = async (clusterId: string) => {
    const versions = await prisma.clusterVersions.findMany({
        where: { cluster_id: clusterId }
    });

    let newVersion;
    if (versions.length === 0) {
        newVersion = await prisma.clusterVersions.create({
            data: {
                cluster_id: clusterId,
                price: 99999,
                version: 1
            }
        });
    } else {
        let newVersionNum = Math.max(...versions.map(v => v.version)) + 1;
        newVersion = await prisma.clusterVersions.create({
            data: {
                cluster_id: clusterId,
                price: 99999,
                version: newVersionNum
            }
        });
    }
    return newVersion;
}

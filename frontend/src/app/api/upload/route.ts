import { NextResponse } from "next/server";
import { createWriteStream } from "fs";
import path from "path";
import prisma from "@/libs/prisma";
import { path_verify } from "@/features/path_verify";

const UPLOAD_DIR = path.join(process.cwd(), "..", "storage", "clusters");

// Ensure upload directory exists
await path_verify(UPLOAD_DIR);

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		// data streaming
		const chunk = formData.get("chunk") as File;
		const index = Number(formData.get("index"));
		const totalChunks = Number(formData.get("totalChunks"));
		
		if (!chunk) {
			return NextResponse.json({ error: "No chunk provided" }, { status: 400 });
		}

		// data information
		const fileName = formData.get("fileName") as string;
		const resourceId = formData.get("resourceId") as string;
		const clusterId = formData.get("clusterId") as string;
		const versionId = formData.get("versionId") as string;
		if (!fileName || !resourceId || !clusterId || !versionId) {
			return NextResponse.json({ error: "No data information provided" }, { status: 400 });
		}

		// Construct directory path
        const targetPath = path.join(UPLOAD_DIR, clusterId, "versions", versionId, "images");
        await path_verify(targetPath);
        const filePath = path.join(targetPath, fileName);

		// Append chunk to the correct file
		const writeStream = createWriteStream(filePath, { flags: "a" });
		const stream = chunk.stream();
		const reader = stream.getReader();

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break; // Stop when stream ends

				writeStream.write(value); // Write chunk to file
			}
		} catch (error) {
			console.error("Error writing to file:", error);
		} finally {
			reader.releaseLock();
			writeStream.end(); // Close the file stream properly
		}
		await prisma.images.update({
			where: {
				resource_id_file_name: {
					file_name: fileName,
					resource_id: resourceId,
				},
			},
			data: {
				status: "AVAILABLE", // Mark as available once uploaded
			},
		});

		if (index + 1 === totalChunks) {
			return NextResponse.json({ message: `Upload complete for ${fileName}`, filePath });
		}

		return NextResponse.json({ message: `Chunk ${index + 1} received for ${fileName}` });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}

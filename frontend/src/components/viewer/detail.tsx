"use client"

import { useEffect, useState } from "react";
import Player2 from "../version/player"
import { ClusterVersions } from "@prisma/client";
import { MultiSelect } from "primereact/multiselect";
import { ToggleButton } from "primereact/togglebutton";
import { objectClasses } from "@/types/classes";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";

type ClassesOptions = {
	label: string;
	value: number
}

export default function ViewerDetail({ data }: { data: ClusterVersions }) {
	const [baseSrc] = useState(`http://localhost:5000/video/${data.cluster_id}/${data.id}`);
	const [showVideo, setShowVideo] = useState(true);
	const [options, setOptions] = useState<ClassesOptions[]>([]);


	const [videoSrc, setVideoSrc] = useState<string>("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
	const [showLabel, setShowlabel] = useState<boolean>(true);
	const [selectedClasses, setSelectedClasses] = useState<ClassesOptions[]>([]);


	const [renderProgress, setRenderProgress] = useState<number>(0);
	const [currentImage, setCurrentImage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// set available classes options
	useEffect(() => {
		if (data?.classes) {
			try {
				const classes: number[] = JSON.parse(data.classes.toString());
				console.log("Found in video", classes);
				const newOptions = classes.map((value) => ({
					label: objectClasses[value],
					value: value
				}))
				setOptions(newOptions)
			} catch (error) {
				console.error("Error parsing classes:", error);
				setOptions([]);
			}
		}
	}, [data]);

	const handleApply = () => {
		// setShowVideo(false);
		const prefix = showLabel ? "l_" : "nl_";
		const sortedClasses = [...selectedClasses].sort();
		const classString = sortedClasses.length > 1 ? sortedClasses.join("_") : sortedClasses[0];


		const videoName = prefix + classString
		const src = `${baseSrc}/${encodeURIComponent(videoName)}.mp4`
		try {
			setRenderProgress(0);
			setCurrentImage('');
			setIsLoading(true);

			const eventSource = new EventSource(`http://localhost:5000/api/segmentation/render?clusterId=${data.cluster_id}&versionId=${data.id}&showLabel=${showLabel}&classes=${selectedClasses.join(",")}`);
			eventSource.onmessage = (event) => {
				const res = JSON.parse(event.data);
				setRenderProgress(res.progress);
				setCurrentImage(res.current_image);

				// Close the connection when processing is complete
				if (res.progress === 100) {
					eventSource.close();
					setVideoSrc(src);
					setShowVideo(true);
					setIsLoading(false);
				}
			};

			eventSource.onerror = () => {
				eventSource.close();
			};

		} catch (error) {
			console.error("Error applying settings:", error);
		}
	}

	return (
		<div className="max-w-screen-xl mx-auto p-4">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-4">
					{showVideo && (
						<Player2 url={videoSrc} />
					)}
				</div>
				<div className="lg:col-span-1 space-y-4">
					<Card className="shadow-md">
						<h3 className="text-lg font-semibold mb-4 pb-2 border-b">Video Settings</h3>
						<div className="space-y-3">
							<div>
								<label className="text-sm block mb-2">Display Classes:</label>
								<MultiSelect
									value={selectedClasses} // Avoid undefined issues
									options={options}
									onChange={(e) => setSelectedClasses(e.value)}
									display="chip"
									optionLabel="label"
									optionValue="value"
									placeholder="Select Objects"
									className="w-full"
								/>
							</div>

							<div className="flex items-center justify-between">
								<label className="text-sm">Show Labels:</label>
								<ToggleButton
									checked={showLabel}
									onChange={(e) => setShowlabel(e.value)}
									onLabel="On"
									offLabel="Off"
									className="w-20"
								/>
							</div>
							{isLoading && (
								<div className="pt-2">
									<label className="text-sm block mb-2">
										Processing: {currentImage && `${currentImage.split('/').pop()}`}
									</label>
									<ProgressBar value={renderProgress} />
								</div>
							)}
							<Button
								label="Apply"
								icon="pi pi-check"
								className="w-full"
								onClick={handleApply}
							/>
						</div>
					</Card>
				</div>
				<div className="lg:col-span-2 space-y-4">
					{/* <Card className="shadow-md">
						<div className="space-y-3">
							<div>
								<div className="flex flex-row gap-2 items-center">
									<i className="pi pi-map-marker"></i>
									<h2 className="text-xl font-bold line-clamp-1">{}</h2>
								</div>
								<div className="flex items-center text-sm text-gray-500 mt-1">
									<span className="mr-2">
										<i className="pi pi-calendar mr-1"></i>
										{formattedDate}
									</span>
									<span className="mr-2">
										<i className="pi pi-tag mr-1"></i>
										version {data.version}
									</span>
								</div>
							</div>

							<div className="border-t pt-3">
								<div className="mb-2 text-sm text-gray-600">Classes:</div>
								<div className="flex flex-wrap gap-2">
									{foundObject.length > 0 ? (
										foundObject.map((c, index) => (
											<Tag key={index} value={objectClasses[c] || c} />
										))
									) : (
										<span className="text-gray-500 text-sm">No classes defined</span>
									)}
								</div>
							</div>

							<div className="flex justify-between items-center pt-2 border-t">
								<div className="flex items-center">

								</div>
								<SplitButton
									label="Export"
									icon="pi pi-download"
									className="p-button-outlined"
									model={items}
								/>
							</div>
						</div>
					</Card> */}
				</div>
			</div>
		</div>
	)
}

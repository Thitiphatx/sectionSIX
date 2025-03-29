"use client";

import React, { useMemo, useEffect, useState } from "react";
import View360, { ControlBar, EquirectProjection } from "@egjs/react-view360";
import "@egjs/react-view360/css/view360.min.css";
import "@egjs/react-view360/css/control-bar.min.css";
import { Button } from "primereact/button";

export default function Player2({ url }: { url: string | null }) {
	const [isClient, setIsClient] = useState(false);
	const [source, setSource] = useState<string | null>(null);

	useEffect(() => {
		setIsClient(true);
	}, [])

	useEffect(() => {
		checkAvailability();
	}, [url])

	const checkAvailability = async () => {
		if (url) {
			const response = await fetch(url, { method: "HEAD" });
			if (response.ok) {
				setSource(url);
			} else {
				setSource(null);
			}
		}
	}

	const projection = useMemo(() => {
		if (!isClient || !source) return null; // Prevent SSR issues
		return new EquirectProjection({
			video: true,
			src: source,
		});
	}, [source, isClient]);

	const controlBar = useMemo(() => {
		if (!isClient || !url) return null; // Prevent SSR issues
		return new ControlBar({
			autoHide: { delay: 0 }, // Control bar always visible
			playButton: true, // Enable play button
			progressBar: true, // Show progress bar
			clickToPlay: true,
			volumeButton: false,
			fullscreenButton: true,
			pieView: true,
		});
	}, [url, isClient]);

	if (!isClient || !projection || !controlBar) return (
		<div className="w-full h-full flex flex-col justify-center items-center gap-5 bg-zinc-100 rounded-xl">
			<h1>Server not responding</h1>
			<Button icon="pi pi-refresh" label="Refresh" outlined onClick={checkAvailability}/>
		</div>
	); // Ensure everything is loaded before rendering

	return (
		<div className="w-full">
			<View360 className="is-16by9" projection={projection} plugins={[controlBar]} />
		</div>
	);
}

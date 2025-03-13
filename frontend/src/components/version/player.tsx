"use client";

import React, { useMemo, useEffect, useState } from "react";
import View360, { ControlBar, EquirectProjection } from "@egjs/react-view360";
import "@egjs/react-view360/css/view360.min.css";
import "@egjs/react-view360/css/control-bar.min.css";

export default function Player2({ url }: { url: string | null }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, [])

	const projection = useMemo(() => {
		if (!isClient || !url) return null; // Prevent SSR issues
		return new EquirectProjection({
			video: true,
			src: url,
		});
	}, [url, isClient]);

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

	if (!isClient || !projection || !controlBar) return null; // Ensure everything is loaded before rendering

	return (
		<div className="w-full">
			<View360 className="is-16by9" projection={projection} plugins={[controlBar]} />
		</div>
	);
}

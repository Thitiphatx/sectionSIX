"use client"
import { useEffect, useState } from "react";
import Player2 from "@/components/version/player";
import { useVersionContext } from "@/contexts/version/versionContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";

export default function VideoPlayer() {
    const { data, classList, loadVideo, showLabel } = useVersionContext();
    const [url, setUrl] = useState<string>("");
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    useEffect(() => {
        const sortedClasses = [...classList].sort();
        const classString = sortedClasses.length > 1 ? sortedClasses.join("_") : sortedClasses[0] || "";
        if (classString !== "") {
            const prefix = showLabel ? "l_" : "nl_";
            const videoName = prefix + classString
            setUrl(`http://localhost:5000/video/${data.cluster_id}/${data.id}/${encodeURIComponent(videoName)}.mp4`)
        }
    }, [classList, loadVideo, data, showLabel]);

    // Effect to handle the overlay when loadVideo changes
    useEffect(() => {
        if (loadVideo) {
            setShowOverlay(true);

            // Set a timeout to hide the overlay after 2 seconds
            const timer = setTimeout(() => {
                setShowOverlay(false);
            }, 2000);

            // Clean up the timer if the component unmounts or loadVideo changes again
            return () => clearTimeout(timer);
        }
    }, [loadVideo]);

    return (
        <div className="relative w-full">
            {url !== "" && (
                <div className="aspect-video bg-zinc-900 rounded-md overflow-hidden">
                    <Player2 url={url} />
                </div>
            )}

            {/* PrimeReact overlay with spinner */}
            {showOverlay && (
                <div className="absolute inset-0 bg-black bg-opacity-80 z-10 flex flex-col items-center justify-center w-full h-full transition-all duration-500 ease-in-out rounded-md">
                    <ProgressSpinner
                        style={{ width: '50px', height: '50px' }}
                        strokeWidth="4"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"
                    />
                    <div className="text-white mt-4 font-medium">Loading video...</div>
                </div>
            )}

            {/* Fallback when no URL or not loading */}
            {url === "" && !loadVideo && (
                <div className="bg-zinc-700 aspect-video rounded-md flex items-center justify-center">
                    <div className="text-zinc-400 font-medium">No video selected</div>
                </div>
            )}
        </div>
    );
}
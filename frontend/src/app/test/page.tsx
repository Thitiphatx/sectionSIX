"use client"

import Player2 from "@/components/version/player";
import { Button } from "primereact/button";
import { useState } from "react";

export default function page() {
    const [urls] = useState([
        "",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    ]);
    const [selected, setSelected] = useState(0);
    const handleSwitch = () => {
        if (selected == 1) {
            setSelected(2);
        } else {
            setSelected(1);
        }
    }
    return (
        <div>
            {selected}
            <Button onClick={handleSwitch} label="switch" />
            <Player2 url={urls[selected]} />
        </div>
    )
}

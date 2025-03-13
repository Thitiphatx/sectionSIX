"use client"

import { useSearchParams } from "next/navigation";
import Player2 from "../../components/version/player";

export default function PlayerPage() {
    const searchParams = useSearchParams();


    return (
        <div><Player2 url={searchParams.get("src")} /></div>
    )
}

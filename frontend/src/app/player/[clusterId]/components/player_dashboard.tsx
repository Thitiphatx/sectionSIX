"use client"

import { Card } from "primereact/card"
import PlayerPanel from "./player_panel"
import PlayerController from "./player_controller"
import PlayerInfo from "./player_info"

export default function PlayerDashboard() {
    return (
        <Card>
            <div className="grid grid-cols-2">
                {/* player */}
                <PlayerPanel />

                {/* controller */}
                <PlayerController />

                {/* info */}
                <PlayerInfo />
            </div>
        </Card>
    )
}

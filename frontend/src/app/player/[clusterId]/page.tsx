import Player2 from "../../../components/version/player";


export default async function Player({ params }: { params: Promise<{ clusterId: string }> }) {
    const { clusterId } = await params;
    return (
        <div className="max-w-screen-lg">
            <Player2 />
            {/* <VideoPlayer videoSrc="/test2.mp4" /> */}
            {/* <PlayerDashboard /> */}
        </div>
    )
}

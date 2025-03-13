import prisma from "@/libs/prisma";
import SegmentList from "./components/segment_list";
import { SegmentContext } from "./utils/context";
import SegmentDashboard from "./components/segment_dashboard";

export default async function Segment() {
	const data = await prisma.clusters.findMany();
	return (
		<div>
			<SegmentDashboard />
		</div>
	)
}

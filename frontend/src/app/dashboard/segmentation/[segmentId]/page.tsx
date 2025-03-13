
export default async function SegmentLanding(params: Promise<{ segmentId: string }>) {
    const { segmentId } = await params;
  return (
    <div>{segmentId}</div>
  )
}

"use client"
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Badge } from 'primereact/badge'
import { useRouter } from 'next/navigation'
import Player2 from '../version/player'
import { versionWithCluster } from '@/app/viewer/[versionId]/page'

export default function Purchase({ versionData }: { versionData: versionWithCluster }) {
    const router = useRouter();

    const submitPurchase = () => {
        router.push(`/checkout?versionId=${versionData.id}`)
    }

    // Format price with currency symbol
    const formattedPrice = new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(versionData.price || 0);

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Player2 url={`${process.env.NEXT_PUBLIC_API_URL}/video/${versionData.cluster_id}/${versionData.id}/l_0.mp4`} />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-0 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 m-0">Purchase</h3>
                            <Badge value="Available" severity="success" />
                        </div>
                        <Divider />

                        <div className="space-y-6 py-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Product Price</span>
                                    <span className="text-lg font-semibold">{formattedPrice}</span>
                                </div>
                            </div>

                            <Divider />

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-xl font-bold">{formattedPrice}</span>
                            </div>

                            {/* Buy Button */}
                            <Button
                                label="Buy Now"
                                icon="pi pi-shopping-cart"
                                className="w-full p-3"
                                severity="success"
                                onClick={submitPurchase}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
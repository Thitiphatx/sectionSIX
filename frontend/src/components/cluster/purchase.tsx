"use client"
import { useVersionContext } from '@/contexts/version/versionContext'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Badge } from 'primereact/badge'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Purchase() {
    const router = useRouter();
    const { data } = useVersionContext();
    
    const submitPurchase = () => {
        router.push(`/checkout?versionId=${data.id}`)
    }
    
    // Format price with currency symbol
    const formattedPrice = new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(data.price || 0);
    
    return (
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
    )
}
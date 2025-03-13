'use client'

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
    const [sessionId, setSessionId] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const toast = useRef<any>(null);

    useEffect(() => {
        const sessionIdFromUrl = new URLSearchParams(window.location.search).get('session_id');
        setSessionId(sessionIdFromUrl || '');
        
        // Simulate loading for demonstration purposes
        const timer = setTimeout(() => {
            setLoading(false);
            toast.current.show({
                severity: 'success',
                summary: 'Payment Successful',
                detail: 'Your transaction has been processed successfully!',
                life: 3000
            });
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);


    const navigateToOrders = () => {
        router.push("/account/purchases")
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Toast ref={toast} />
            
            {loading ? (
                <div className="flex flex-col items-center">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                    <p className="mt-4 text-gray-600">Processing your payment...</p>
                </div>
            ) : (
                <Card className="w-full max-w-lg shadow-lg">
                    <div className="text-center py-6">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-check-circle text-green-500 text-4xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600 mb-6">Your order has been processed and confirmed.</p>
                        
                        <Divider />
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="flex flex-col gap-2 text-left">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                                </div>
                                {sessionId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Transaction ID:</span>
                                        <span className="font-medium">{sessionId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="text-green-500 font-medium">Confirmed</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button label="View Order Details" icon="pi pi-list" className="p-button-outlined" onClick={navigateToOrders} />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SuccessPage;
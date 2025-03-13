"use client"

import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import convertToSubCurrency from '@/features/stripe/convertToSubcurrency';
import { Button } from 'primereact/button';


export default function Checkout({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: convertToSubCurrency(amount) })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [amount])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `/payment-success?amount=${amount}`
            }
        })

        if (error) {
            setErrorMessage(error.message);
        } else {

        }
        setLoading(false);
    }

    if (!clientSecret || !stripe || !elements) {
        return <div>Loading..</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <div>{errorMessage}</div>}
            {clientSecret && <PaymentElement />}
            <Button loading={loading} label="Pay" />
        </form>
    )
}

import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const { amount, currency, userId, versionId } = await req.json(); // Example: Pass the amount and currency from the client

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in the smallest currency unit (e.g., cents)
            currency: currency,
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: userId,
                versionId: versionId
            }
        });

        return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return new Response('Error creating checkout session', { status: 500 });
    }
}
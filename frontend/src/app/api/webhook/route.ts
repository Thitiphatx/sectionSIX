import Stripe from "stripe";
import { stripe } from "@/libs/stripe"
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        return new NextResponse("invalid signature", { status: 400 })
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    if (event.type === 'payment_intent.succeeded') {
        await prisma.transaction.create({
            data: {
                user_id: paymentIntent.metadata.userId,
                version_id: paymentIntent.metadata.versionId,
                price: paymentIntent.amount,
                status: "SUCCESS"
            }
        })
    }
    return new NextResponse("success", { status: 200})
}
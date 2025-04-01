'use client'

import { useState, useEffect, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	useStripe,
	useElements,
	PaymentElement
} from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import ErrorPage from "@/components/error";
import { useSession } from "next-auth/react";
import { getVersionPrice } from "@/features/getVersionPrice";
import { ProgressSpinner } from "primereact/progressspinner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutForm = ({ versionId, amount }: { versionId: string, amount: number }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const authSession = useSession();

	useEffect(() => {
		fetch("/api/checkout-session", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				amount,
				currency: "thb",
				userId: authSession.data?.user.id,
				versionId
			}),
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret));
	}, [amount, authSession.data?.user.id, versionId]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements || !clientSecret) return;

		const { error: submitError } = await elements.submit();
		console.log(submitError)
		setIsLoading(true);

		// Confirm the card payment
		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				return_url: "http://localhost:3000/success"
			}
		});

		console.log(error);
		setIsLoading(false);
	};
	if (!clientSecret) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[300px] p-6">
				<div className="text-center">
					<ProgressSpinner />
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูลการชำระเงิน...</p>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
			<PaymentElement />
			<button
				type="submit"
				disabled={isLoading || !stripe}
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
			>
				{isLoading ? "Processing..." : "Pay Now"}
			</button>
		</form>
	);
};

// Component that uses searchParams
function CheckoutPageContent() {
	const searchParams = useSearchParams();
	const [versionId] = useState(searchParams.get("versionId") ?? "");
	const [amount, setAmount] = useState<number | null>(null);

	useEffect(() => {
		const fetchPrice = async () => {
			const price = await getVersionPrice(versionId);
			if (!price) return;
			setAmount(price);
		}
		fetchPrice();

	}, [versionId])

	if (!versionId || !amount) {
		console.log(versionId, amount)
		return (
			<ErrorPage message="No checkout data" />
		)
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				mode: "payment",
				amount: amount * 100,
				currency: "thb"
			}}
		>
			<CheckoutForm versionId={versionId} amount={amount} />
		</Elements>
	)
}

// Main component with Suspense
export default function CheckoutPage() {
	return (
		<Suspense fallback={
			<div className="flex flex-col items-center justify-center min-h-[300px] p-6">
				<div className="text-center">
					<ProgressSpinner />
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูล...</p>
				</div>
			</div>
		}>
			<CheckoutPageContent />
		</Suspense>
	);
}
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

const CheckoutForm = ({ versionId, amount }: { versionId: string, amount: number}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const authSession = useSession();

	useEffect(() => {
		// Request a PaymentIntent from the backend
		if (!amount || !authSession.data?.user.id || !versionId) return;
		fetch("/api/checkout-session", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ 
				amount: amount,
				currency: "thb",
				userId: authSession.data?.user.id,
				versionId: versionId
			}),
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret))
			.catch(err => {
				setErrorMessage("Unable to initialize payment. Please try again.");
				console.error("Payment initialization error:", err);
			});
	}, [amount, authSession.data?.user.id, versionId]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements || !clientSecret) return;
		
		// Clear any previous errors
		setErrorMessage(null);
		setIsLoading(true);
		
		// First validate the payment elements
		const { error: submitError } = await elements.submit();
		if (submitError) {
			setErrorMessage(submitError.message || "Please check your payment information.");
			setIsLoading(false);
			return;
		}

		// Confirm the card payment
		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				return_url: "http://localhost:3000/success"
			}
		});

		// Handle payment confirmation errors
		if (error) {
			setErrorMessage(error.message || "An error occurred during payment. Please try again.");
			console.error("Payment confirmation error:", error);
		}
		
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
		<form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow bg-white">
			<PaymentElement />
			{errorMessage && (
				<div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
					<p className="text-sm">{errorMessage}</p>
				</div>
			)}
			
			<button
				type="submit"
				disabled={isLoading || !stripe}
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mt-4"
			>
				{isLoading ? "Processing..." : "Pay Now"}
			</button>
		</form>
	);
};

// Component to handle params extraction
const CheckoutContent = () => {
	const searchParams = useSearchParams();
	const [versionId] = useState(searchParams.get("versionId") ?? "");
	const [amount, setAmount] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const price = await getVersionPrice(versionId);
				if (!price) {
					setError("Unable to retrieve product price");
					return;
				}
				setAmount(price);
			} catch (err) {
				setError("Error fetching product information");
				console.error("Price fetch error:", err);
			}
		}
		
		if (versionId) {
			fetchPrice();
		} else {
			setError("No product selected");
		}
	}, [versionId]);

	if (error) {
		return <ErrorPage message={error} />;
	}

	if (!versionId || !amount) {
		return <ErrorPage message="No checkout data" />;
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
	);
};

// Suspense wrapper for the checkout page
const CheckoutPage = () => {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-[300px]">
				<div className="text-center">
					<ProgressSpinner />
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
				</div>
			</div>
		}>
			<CheckoutContent />
		</Suspense>
	);
};

export default CheckoutPage;
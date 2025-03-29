import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import { PrimeReactProvider } from 'primereact/api';
import "./globals.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-green/theme.css';

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const comfortaa = Comfortaa({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Section6",
	description: "wow",
};

const value = {
	ripple: true,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-theme="dark" suppressHydrationWarning>
			<body className={`${comfortaa.className}  antialiased min-h-screen flex flex-col bg-zinc-200`}>
				<SessionProvider refetchInterval={0}>
					<PrimeReactProvider value={value}>
						<header className="w-full">
							<Navbar />
						</header>
						<main className="flex-1">
							{children}
						</main>
						<footer>
							<Footer />
						</footer>
					</PrimeReactProvider>
				</SessionProvider>
			</body>
		</html>
	);
}

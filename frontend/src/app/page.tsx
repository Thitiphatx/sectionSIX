"use client"
import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import SearchBar from '@/components/home/search_bar';

export default function Home() {
	const toast = useRef(null);

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<Toast ref={toast} />
			{/* Hero Section */}
			<section className="py-20 px-4 text-center">
				<div className="container mx-auto max-w-4xl">
					<h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Panoramic Segmentation Videos for Any Location</h1>
					<p className="text-xl text-gray-600 mb-10">Search any address and visualize it with our advanced segmentation technology</p>
					<SearchBar />
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Segmentation Service</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-6 rounded-lg shadow-md text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<i className="pi pi-eye text-blue-600 text-2xl"></i>
							</div>
							<h3 className="text-xl font-semibold mb-3">High-Quality Visualization</h3>
							<p className="text-gray-600">Our panoramic views offer crystal clear segmentation with multiple class options.</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-md text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<i className="pi pi-map-marker text-green-600 text-2xl"></i>
							</div>
							<h3 className="text-xl font-semibold mb-3">Global Coverage</h3>
							<p className="text-gray-600">Search any address worldwide and get accurate segmentation videos.</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-md text-center">
							<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<i className="pi pi-sliders-h text-purple-600 text-2xl"></i>
							</div>
							<h3 className="text-xl font-semibold mb-3">Customizable Classes</h3>
							<p className="text-gray-600">Select and customize which segmentation classes you want to visualize.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Overview */}
			<section className="py-16 px-4 bg-gray-50">
				<div className="container mx-auto max-w-4xl">
					<h2 className="text-3xl font-bold text-center mb-3">Transparent Pricing</h2>
					<p className="text-center text-gray-600 mb-10">Prices vary by location based on data availability and coverage</p>

					<div className="bg-white p-8 rounded-lg shadow-lg">
						<div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-6">
							<div>
								<h3 className="text-xl font-semibold">Urban Areas</h3>
								<p className="text-gray-600">Major cities and densely populated regions</p>
							</div>
							<div className="mt-4 md:mt-0">
								<span className="text-3xl font-bold text-blue-600">$29.99 - $59.99</span>
							</div>
						</div>

						<div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-6">
							<div>
								<h3 className="text-xl font-semibold">Suburban Areas</h3>
								<p className="text-gray-600">Residential neighborhoods outside city centers</p>
							</div>
							<div className="mt-4 md:mt-0">
								<span className="text-3xl font-bold text-blue-600">$19.99 - $39.99</span>
							</div>
						</div>

						<div className="flex flex-col md:flex-row justify-between items-center">
							<div>
								<h3 className="text-xl font-semibold">Rural Areas</h3>
								<p className="text-gray-600">Countryside and less populated regions</p>
							</div>
							<div className="mt-4 md:mt-0">
								<span className="text-3xl font-bold text-blue-600">$14.99 - $29.99</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
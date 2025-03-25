"use client"

import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import React from 'react'

export default function Footer() {
    return (
        <div className="bg-gray-800 text-white py-12 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Section6</h3>
                        <p className="text-gray-400">Advanced panoramic segmentation videos for any address worldwide.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Home</a></li>
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><a href="#" className="hover:text-white">Services</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Documentation</a></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                            <li><a href="#" className="hover:text-white">FAQ</a></li>
                            <li><a href="#" className="hover:text-white">Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe to get updates on new features and locations.</p>
                        <div className="flex">
                            <InputText placeholder="Your email" className="p-2 w-full" />
                            <Button icon="pi pi-arrow-right" className="p-button-primary ml-2" />
                        </div>
                    </div>
                </div>
                <Divider className="my-8 border-gray-700" />
                <div className="text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Section6. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

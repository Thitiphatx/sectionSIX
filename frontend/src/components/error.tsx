"use client"

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';

export default function ErrorPage({ message = "Data not found", title = "Error", suggestion = "Please try again later" }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Head>
        <title>{title} | Your Application</title>
      </Head>

      <Card className="shadow-4 w-full max-w-lg">
        <div className="flex flex-col items-center text-center p-4">
          <div className="my-5">
            <i className="pi pi-exclamation-circle text-red-500" style={{ fontSize: '5rem' }}></i>
          </div>

          <h1 className="text-4xl font-bold text-red-500 mb-2">{title}</h1>
          <p className="text-lg mb-4 text-gray-700">{message}</p>
          <p className="text-sm mb-5 text-gray-500">{suggestion}</p>

          <div className="flex gap-3">
            <Link href="/" passHref>
              <Button label="Go to Home" icon="pi pi-home" className="p-button-primary" />
            </Link>
            <Button
              label="Try Again"
              icon="pi pi-refresh"
              className="p-button-outlined"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
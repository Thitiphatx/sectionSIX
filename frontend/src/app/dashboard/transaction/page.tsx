// src/app/transactions/page.tsx
'use client';

import TransactionTable from '@/components/dashboard/transaction/table';

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <TransactionTable defaultPageSize={10} />
      </div>
    </div>
  );
}
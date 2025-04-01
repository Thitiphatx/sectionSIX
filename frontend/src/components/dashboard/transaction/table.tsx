// src/components/TransactionTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Nullable } from 'primereact/ts-helpers';
import { Prisma, TransactionStatus } from '@prisma/client';
import { FloatLabel } from 'primereact/floatlabel';
import TransactionDetailModal from './detail';

// Type definitions based on your Prisma schema
// export type Transaction = {
//     id: string;
//     user_id: string;
//     user: {
//         name: string;
//         email: string;
//     };
//     version_id: string;
//     version: {
//         version: number;
//         cluster: {
//             name: string;
//         };
//     };
//     purchase_date: Date;
//     price: number;
//     status: 'SUCCESS' | 'FAILED';
// };

export type TransactionDetail = Prisma.TransactionGetPayload<{
    include: {
        user: true,
        version: {
            include: {
                cluster: true
            }
        }
    };
}>;

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<TransactionStatus | "ALL">("ALL");
    const toast = useRef<Toast>(null);

    // Status options for dropdown
    const statusOptions = [
        { label: 'All', value: 'ALL' },
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Failed', value: 'FAILED' }
    ];

    useEffect(() => {
        const filter = {
            search: search,
            startDate: dates ? dates[0] : null,
            endDate: dates ? dates[1] : null,
            status: status
        }

        const queryString = new URLSearchParams({
            ...(filter.status !== 'ALL' && { status: filter.status }),
            ...(filter.search && { search: filter.search }),
            ...(filter.startDate && { startDate: filter.startDate.toISOString() }),
            ...(filter.endDate && { endDate: filter.endDate.toISOString() })
        })
        // console.log(queryString.toString())
        fetchTransactions(queryString);
    }, [dates, search, status])

    const fetchTransactions = async (queryString?: URLSearchParams) => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await fetch(`/api/getTransaction${queryString ? `?${queryString.toString()}` : ""}`);

            if (!response.ok) {
                throw new Error('Failed to fetch transaction data');
            }

            const data = await response.json();

            // Handle the case where transactions might be null
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No transactions data',
                life: 3000
            });
            // Reset data on error
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Load transactions based on pagination and filters
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Format price as currency
    const priceTemplate = (rowData: TransactionDetail) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(rowData.price);
    };

    // Format date
    const dateTemplate = (rowData: TransactionDetail) => {
        return new Date(rowData.purchase_date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearFilters = () => {
        setDates(null)
        setSearch("")
        setStatus("ALL")
    }

    // Status badge
    const statusTemplate = (rowData: TransactionDetail) => {
        const severity = rowData.status === 'SUCCESS' ? 'success' : 'danger';
        return <Tag severity={severity} value={rowData.status} />;
    };

    // Custom empty message component
    const emptyMessageTemplate = () => {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <i className="pi pi-search text-gray-400 text-5xl mb-4"></i>
                <p className="text-xl text-gray-500 mb-2">No transactions found</p>
                {/* <p className="text-gray-400 mb-4">
                    {filters.search || filters.status !== 'ALL' || filters.dateRange[0] || filters.dateRange[1] ?
                        'Try adjusting your filters' :
                        'There are no transactions in the system yet'}
                </p>
                {(filters.search || filters.status !== 'ALL' || filters.dateRange[0] || filters.dateRange[1]) && (
                    <Button
                        label="Clear Filters"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined"
                        onClick={clearFilters}
                    />
                )} */}
            </div>
        );
    };
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    // Function to open the modal with a specific transaction
    const openTransactionModal = (transaction: TransactionDetail) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    // Function to close the modal
    const closeTransactionModal = () => {
        setModalVisible(false);
    };

    // Modify the Actions column in your DataTable to use this function
    const actionBodyTemplate = (rowData: TransactionDetail) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-eye"
                className="p-button-rounded p-button-text p-button-sm"
                tooltip="View Details"
                tooltipOptions={{ position: 'top' }}
                onClick={() => openTransactionModal(rowData)}
            />
        </div>
    );
    return (
        <div className="card">
            <Toast ref={toast} />

            {/* Filters section */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 p-5 pt-10 bg-gray-50 rounded-lg">
                <div className="w-full md:w-1/4">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            className="w-full"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </IconField>
                </div>

                <div className="w-full md:w-1/4">
                    <Dropdown
                        value={status}
                        options={statusOptions}
                        onChange={(e) => setStatus(e.value)}
                        placeholder="Filter by Status"
                        className="w-full"
                    />
                </div>

                <div className="w-full md:w-1/3">
                    <FloatLabel>
                        <Calendar
                            inputId='range'
                            value={dates}
                            dateFormat='dd/mm/yy'
                            onChange={(e) => setDates(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                        />
                        <label htmlFor="range">Date range</label>
                    </FloatLabel>
                </div>

                <div className="w-full md:w-auto flex justify-end">
                    <Button
                        icon="pi pi-filter-slash"
                        label="Clear"
                        className="p-button-outlined"
                        onClick={clearFilters}
                    />
                </div>
            </div>

            {/* Data table */}
            <DataTable
                value={transactions}
                paginator
                rows={10}
                size='small'
                loading={loading}
                emptyMessage={emptyMessageTemplate}
                rowHover
                stripedRows
            >
                <Column field="id" header="Transaction ID" style={{ width: "21%" }} />
                <Column field="user.name" header="Customer" />
                <Column field="version.cluster.name" header="Cluster" />
                <Column field="version.version" header="Version" />
                <Column
                    field="purchase_date"
                    header="Date"
                    body={dateTemplate}
                    style={{ width: "12%" }}
                />
                <Column
                    field="price"
                    header="Amount"
                    body={priceTemplate}
                />
                <Column
                    field="status"
                    header="Status"
                    body={statusTemplate}
                />
                <Column
                    header="Actions"
                    body={actionBodyTemplate}
                />
            </DataTable>
            <TransactionDetailModal
                transaction={selectedTransaction}
                visible={modalVisible}
                onHide={closeTransactionModal}
            />
        </div>
    );
};
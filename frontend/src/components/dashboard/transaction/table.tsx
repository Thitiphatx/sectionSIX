// src/components/TransactionTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

// Type definitions based on your Prisma schema
type Transaction = {
    id: string;
    user_id: string;
    user: {
        name: string;
        email: string;
    };
    version_id: string;
    version: {
        version: number;
        cluster: {
            name: string;
        };
    };
    purchase_date: Date;
    price: number;
    status: 'SUCCESS' | 'FAILED';
};

type TransactionFilters = {
    status: 'SUCCESS' | 'FAILED' | 'ALL';
    dateRange: [Date | null, Date | null];
    userId?: string;
    clusterId?: string;
    search: string;
};

interface TransactionTableProps {
    defaultPageSize?: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ defaultPageSize = 10 }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: defaultPageSize,
        page: 0,
        sortField: 'purchase_date',
        sortOrder: -1
    });

    const [filters, setFilters] = useState<TransactionFilters>({
        status: 'ALL',
        dateRange: [null, null],
        search: ''
    });

    const toast = useRef<Toast>(null);

    // Status options for dropdown
    const statusOptions = [
        { label: 'All', value: 'ALL' },
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Failed', value: 'FAILED' }
    ];

    // Load transactions based on pagination and filters
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);

                // Build query params for API call
                const queryParams = new URLSearchParams({
                    page: lazyParams.page.toString(),
                    pageSize: lazyParams.rows.toString(),
                    sortField: lazyParams.sortField,
                    sortOrder: lazyParams.sortOrder.toString(),
                    ...(filters.status !== 'ALL' && { status: filters.status }),
                    ...(filters.search && { search: filters.search }),
                    ...(filters.userId && { userId: filters.userId }),
                    ...(filters.clusterId && { clusterId: filters.clusterId }),
                    ...(filters.dateRange[0] && { startDate: filters.dateRange[0].toISOString() }),
                    ...(filters.dateRange[1] && { endDate: filters.dateRange[1].toISOString() })
                });

                // Replace with your actual API endpoint
                const response = await fetch(`/api/getTransaction?${queryParams.toString()}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch transaction data');
                }

                const data = await response.json();

                // Handle the case where transactions might be null
                setTransactions(data.transactions || []);
                setTotalRecords(data.totalCount || 0);

                // If we get zero records but we're not on the first page, go back to first page
                if (data.totalCount === 0 && lazyParams.page > 0) {
                    setLazyParams({
                        ...lazyParams,
                        first: 0,
                        page: 0
                    });
                }
            } catch (error) {
                // console.error('Error fetching transactions:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No transactions data',
                    life: 3000
                });
                // Reset data on error
                setTransactions([]);
                setTotalRecords(0);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [lazyParams, filters]);

    // Handle page change
    const onPage = (event: any) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            page: event.page,
            rows: event.rows
        });
    };

    // Handle sort change
    const onSort = (event: any) => {
        setLazyParams({
            ...lazyParams,
            sortField: event.sortField,
            sortOrder: event.sortOrder
        });
    };

    // Handle filter status change
    const onStatusChange = (e: any) => {
        setFilters({
            ...filters,
            status: e.value
        });
        // Reset to first page when filter changes
        setLazyParams({
            ...lazyParams,
            first: 0,
            page: 0
        });
    };

    // Handle date range change
    const onDateRangeChange = (dates: [Date | null, Date | null]) => {
        setFilters({
            ...filters,
            dateRange: dates
        });
        // Reset to first page when filter changes
        setLazyParams({
            ...lazyParams,
            first: 0,
            page: 0
        });
    };

    // Handle search input change
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            search: e.target.value
        });
        // Reset to first page when search changes
        setLazyParams({
            ...lazyParams,
            first: 0,
            page: 0
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            status: 'ALL',
            dateRange: [null, null],
            search: '',
            userId: undefined,
            clusterId: undefined
        });
        // Reset to first page
        setLazyParams({
            ...lazyParams,
            first: 0,
            page: 0
        });
    };

    // Format price as currency
    const priceTemplate = (rowData: Transaction) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(rowData.price);
    };

    // Format date
    const dateTemplate = (rowData: Transaction) => {
        return new Date(rowData.purchase_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Status badge
    const statusTemplate = (rowData: Transaction) => {
        const severity = rowData.status === 'SUCCESS' ? 'success' : 'danger';
        return <Tag severity={severity} value={rowData.status} />;
    };

    // Custom empty message component
    const emptyMessageTemplate = () => {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <i className="pi pi-search text-gray-400 text-5xl mb-4"></i>
                <p className="text-xl text-gray-500 mb-2">No transactions found</p>
                <p className="text-gray-400 mb-4">
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
                )}
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />

            {/* Filters section */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-full md:w-1/4">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            className="w-full"
                            placeholder="Search"
                            value={filters.search}
                            onChange={onSearchChange}    
                        />
                    </IconField>
                </div>

                <div className="w-full md:w-1/4">
                    <Dropdown
                        value={filters.status}
                        options={statusOptions}
                        onChange={onStatusChange}
                        placeholder="Filter by Status"
                        className="w-full"
                    />
                </div>

                <div className="w-full md:w-1/3">
                    <Calendar
                        value={filters.dateRange as any}
                        onChange={(e) => onDateRangeChange(e.value as [Date | null, Date | null])}
                        selectionMode="range"
                        readOnlyInput
                        placeholder="Date Range"
                        className="w-full"
                    />
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
                lazy
                paginator
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                sortField={lazyParams.sortField}
                loading={loading}
                emptyMessage={emptyMessageTemplate}
                className="p-datatable-sm"
                responsiveLayout="scroll"
                rowHover
                stripedRows
            >
                <Column field="id" header="Transaction ID" sortable style={{ width: '8%' }} />
                <Column field="user.name" header="Customer" sortable style={{ width: '15%' }} />
                <Column field="version.cluster.name" header="Cluster" sortable style={{ width: '15%' }} />
                <Column field="version.version" header="Version" sortable style={{ width: '8%' }} />
                <Column
                    field="purchase_date"
                    header="Date"
                    body={dateTemplate}
                    sortable
                    style={{ width: '18%' }}
                />
                <Column
                    field="price"
                    header="Amount"
                    body={priceTemplate}
                    sortable
                    style={{ width: '12%' }}
                />
                <Column
                    field="status"
                    header="Status"
                    body={statusTemplate}
                    sortable
                    style={{ width: '12%' }}
                />
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                className="p-button-rounded p-button-text p-button-sm"
                                tooltip="View Details"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => console.log('View details for:', rowData.id)}
                            />
                            <Button
                                icon="pi pi-download"
                                className="p-button-rounded p-button-text p-button-sm"
                                tooltip="Download Receipt"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => console.log('Download receipt for:', rowData.id)}
                            />
                        </div>
                    )}
                    style={{ width: '12%' }}
                />
            </DataTable>
        </div>
    );
};

export default TransactionTable;
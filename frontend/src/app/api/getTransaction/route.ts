// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse pagination params
        const page = parseInt(searchParams.get('page') || '0');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const sortField = searchParams.get('sortField') || 'purchase_date';
        const sortOrder = parseInt(searchParams.get('sortOrder') || '-1');

        // Parse filter params
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const userId = searchParams.get('userId');
        const clusterId = searchParams.get('clusterId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build filter object
        const filters: any = {};

        // Add status filter if specified
        if (status && status !== 'ALL') {
            filters.status = status;
        }

        // Add user filter if specified
        if (userId) {
            filters.user_id = userId;
        }

        // Add cluster filter if specified
        if (clusterId) {
            filters.version = {
                cluster_id: clusterId
            };
        }

        // Add date range filter if specified
        if (startDate || endDate) {
            filters.purchase_date = {};

            if (startDate) {
                filters.purchase_date.gte = new Date(startDate);
            }

            if (endDate) {
                filters.purchase_date.lte = new Date(endDate);
            }
        }

        // Add search filter if specified
        if (search) {
            filters.OR = [
                {
                    user: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    user: {
                        email: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    version: {
                        cluster: {
                            name: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    }
                },
                {
                    id: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }

        // Build sort object
        const orderBy: any = {};
        // Handle nested sort fields
        if (sortField.includes('.')) {
            const parts = sortField.split('.');
            if (parts.length === 2) {
                orderBy[parts[0]] = {
                    [parts[1]]: sortOrder === 1 ? 'asc' : 'desc'
                };
            } else if (parts.length === 3) {
                orderBy[parts[0]] = {
                    [parts[1]]: {
                        [parts[2]]: sortOrder === 1 ? 'asc' : 'desc'
                    }
                };
            }
        } else {
            orderBy[sortField] = sortOrder === 1 ? 'asc' : 'desc';
        }

        // Get total count for pagination
        const totalCount = await prisma.transaction.count({
            where: filters
        });

        // Return empty array if no records found
        if (totalCount === 0) {
            return NextResponse.json({
                transactions: [],
                totalCount: 0,
                page,
                pageSize,
                totalPages: 0
            });
        }

        // Get transactions with pagination, filtering and sorting
        const transactions = await prisma.transaction.findMany({
            where: filters,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                version: {
                    select: {
                        version: true,
                        cluster: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy,
            skip: page * pageSize,
            take: pageSize
        });

        return NextResponse.json({
            transactions: transactions || [],
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize)
        });
    } catch (error) {
        // console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'No transactions', transactions: [], totalCount: 0 },
            { status: 500 }
        );
    }
}
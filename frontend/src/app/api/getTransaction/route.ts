import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { Prisma, TransactionStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const filters: Prisma.TransactionWhereInput = {};

        if (status) {
            filters.status = status as TransactionStatus;
        }

        if (startDate && endDate) {
            filters.purchase_date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            filters.purchase_date = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            filters.purchase_date = {
                lte: new Date(endDate),
            };
        }

        if (search) {
            filters.OR = [
                { id: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
                { version: { cluster: { address: { contains: search, mode: "insensitive" } } } }
            ];
        }

        // Get transactions
        const transactions = await prisma.transaction.findMany({
            where: filters,
            include: {
                user: true,
                version: {
                    include: {
                        cluster: true
                    }
                }
            }
        });

        return NextResponse.json({
            transactions: transactions || [],
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'No transactions', transactions: [], totalCount: 0 }, { status: 500 });
    }
}

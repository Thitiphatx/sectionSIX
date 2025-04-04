
import TransactionList from '@/components/account/transactions/TransactionList';
import prisma from '@/libs/prisma';
import ErrorPage from '@/components/error';
import { auth } from '@/libs/auth';
import { Prisma } from '@prisma/client';

export type FullTransaction = Prisma.TransactionGetPayload<{
    include: { 
        version: {
            include: {
                cluster: {
                    select: {
                        address: true,
                        road: true
                    }
                }
            }
        }
    }
}>

export default async function Transaction() {
    const session = await auth();

    if (!session || !session.user) {
        return <ErrorPage message="Unauthorized" />;
    }

    const data = await prisma.transaction.findMany({
        where: { user_id: session.user.id }, // Now it's guaranteed to be valid
        include: { 
            version: {
                include: {
                    cluster: {
                        select: {
                            address: true,
                            road: true
                        }
                    }
                }
            }
        },
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
            <TransactionList data={data} />
        </div>
    );
};

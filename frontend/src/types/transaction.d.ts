import { Prisma } from '@prisma/client';

export type TransactionWithVersion = Prisma.TransactionGetPayload<{
    include: {
        version: true
    }
}>;

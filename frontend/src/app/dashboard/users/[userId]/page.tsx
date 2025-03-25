import TransactionList from "@/components/account/transactions/TransactionList";
import ErrorPage from "@/components/error";
import EditUserPage from "@/components/users/form";
import prisma from "@/libs/prisma";

export default async function UserPage({ params }: { params: { userId: string } }) {
    const { userId } = await params;

    try {
        const userInfo = await prisma.users.findFirst({
            where: { id: userId }
        })

        const transactions = await prisma.transaction.findMany({
            where: { user_id: userId },
            include: {
                version: true
            }
        })

        if (!userInfo || !transactions) {
            return (
                <ErrorPage message="User invalid"/>
            )
        }


        return (
            <div className="space-y-2">
                <EditUserPage data={userInfo} />
                <TransactionList data={transactions}/>
            </div>
        )

    } catch (error) {
        return (
            <ErrorPage message="Error to access data"/>
        )
    }
}

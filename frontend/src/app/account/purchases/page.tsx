import VersionItem from "@/components/version/version_item";
import { auth } from "@/libs/auth";
import prisma from "@/libs/prisma";

export default async function Profile() {
    const session = await auth();
    if (!session) return <div>Unauthorized</div>;

    const transactions = await prisma.transaction.findMany(({
        where: { user_id: session.user.id },
        include: {
            version: {
                include: {
                    cluster: {
                        select: {
                            address: true
                        }
                    },
                    Images: {
                        select: {
                            id: true
                        }
                    }
                }
            },
        }
    }))

    return (
        <div className="grid grid-cols-3 p-4 gap-2">
            {transactions.map((t)=> (
                <VersionItem key={t.id} item={t.version} href={`/viewer/${t.version_id}`}/>
            ))}
        </div>
    )
}

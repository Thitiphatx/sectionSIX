import prisma from "@/libs/prisma";
import ErrorPage from "@/components/error";
import UserDashboard from "@/components/users/user_dashboard";

export default async function Users() {
    try {
        const users = await prisma.users.findMany();
        return (
            <div>
                <UserDashboard data={users} />
            </div>
        )
    } catch (error) {
        console.log(error);
        return (
            <ErrorPage message="Database is offline"/>
        )
    }

}

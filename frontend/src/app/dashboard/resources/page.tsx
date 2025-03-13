import prisma from "@/libs/prisma"
import ErrorPage from "@/components/error";
import ResourceListCard from "@/components/resources/resource_list_card";

export default async function Page() {
    try {
        const resources_list = await prisma.resources.findMany();
        return (
            <div className="flex flex-col gap-1 min-h-full bg-white rounded-md ring-1 ring-zinc-200">
                <ResourceListCard resources_list={resources_list} />
            </div>
        )
    } catch (error) {
        return (
            <div>
                <ErrorPage message="Database is offline"/>
            </div>
        )
    }
}

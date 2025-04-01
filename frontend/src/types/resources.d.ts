
export type ResourceWithImage = Prisma.ResourcesGetPayload<{
    include: { Images: true }
}>

export type ResourceList = Prisma.ResourcesGetPayload<{
    include: {
        Images: {
            select: {
                id: true
            }
        }
    }
}>
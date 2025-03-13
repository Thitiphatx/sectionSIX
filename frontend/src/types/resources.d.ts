import prisma from "@prisma/client"
export type ResourceWithImage = Prisma.ResourcesGetPayload<{
    include: { Images: true }
}>
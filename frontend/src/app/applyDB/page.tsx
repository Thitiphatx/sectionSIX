"use server"

import prisma from "@/libs/prisma"

export default async function Test() {
    await prisma.images.updateMany({
        where: {
            version_id: "857223dc-56e4-4723-a1d0-b6136b2c52d8"
        },
        data: {
            status: "AVAILABLE"
        }
    })
  return (
    <div>page</div>
  )
}

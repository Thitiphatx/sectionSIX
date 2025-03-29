"use server"

import prisma from "@/libs/prisma"

export default async function Test() {
  await prisma.images.updateMany({
      where: {
          version_id: "e3671293-fbcd-4cd8-826b-64046bb8a5a6"
      },
      data: {
          status: "AVAILABLE"
      }
  })
  // await prisma.clusterVersions.update({
  //   where: {
  //     id: "2365324a-9d62-463a-be6d-3420996993ef"
  //   },
  //   data: {
  //     status: "ACTIVE"
  //   }
  // })
  return (
    <div>page</div>
  )
}

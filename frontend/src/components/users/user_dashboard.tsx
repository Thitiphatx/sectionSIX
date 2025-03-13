"use client"

import { Users } from "@prisma/client"
import UserTable from "./user_table"
import { UserContext } from "@/contexts/usersContext"

export default function UserDashboard({ data }: { data: Users[] }) {
  return (
    <UserContext.Provider value={data}>
        <UserTable />
    </UserContext.Provider>
  )
}

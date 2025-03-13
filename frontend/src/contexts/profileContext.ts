"use client"

import { Users } from "@prisma/client";
import { createContext, useContext } from "react";

export const ProfileContext = createContext<Users | undefined>(undefined);

export function useProfileContext() {
    const data = useContext(ProfileContext);

    if (data === undefined) {
        throw new Error("useProfileContext must be use with ProfileContext");
    }
    return data;
}
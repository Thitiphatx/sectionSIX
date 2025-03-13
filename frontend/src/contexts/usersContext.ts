import { Users } from "@prisma/client";
import { createContext, useContext } from "react";

export const UserContext = createContext<Users[] | undefined>(undefined);

export const useUserContext = ()=> {
    const data = useContext(UserContext);
    if (!data) {
        throw new Error("useUserContext must be use with UserContext");
    }
    return data
}
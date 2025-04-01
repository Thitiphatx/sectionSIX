"use client"

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useRef } from "react";


export default function UserMenu({ session }: { session: Session }) {
    const menuRight = useRef<Menu>(null);

    const profileItems = [
        {
            label: 'Profile',
            url: '/account/profile'
        },
        {
            label: 'Dashboard',
            url: '/dashboard'
        },
        {
            label: 'Signout',
            command: () => signOut()
        },
    ]
    
    return (
        <div>
            <Menu model={profileItems} ref={menuRight} popup popupAlignment="right" />
            <Button label={session?.user.name ?? ""} onClick={(event) => menuRight?.current?.toggle(event)} outlined rounded />
        </div>
    )
}

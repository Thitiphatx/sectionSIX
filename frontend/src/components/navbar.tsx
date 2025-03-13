"use client"

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Menubar } from 'primereact/menubar';
import { useRef } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const menuRight = useRef(null);
    const router = useRouter();

    const items = [
        {
            label: 'Section6',
            url: '/',
        },
        {
            label: 'Browse',
            url: '/browse',
        },
        {
            label: 'Pricing',
            url: '/',
        }
    ];

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
    const end = (
        <div>

            {!session?.user.id ? (
                <Button label="Signin" onClick={() => router.push("/authorize/signin")} />
            ) : (
                <>
                    <Menu model={profileItems} ref={menuRight} popup popupAlignment="right" />
                    <Button label={session.user.name ?? ""} onClick={(event) => menuRight?.current?.toggle(event)} outlined rounded/>
                </>
            )}
        </div>
    )
    return (
        <Menubar model={items} end={end} />
    )
}

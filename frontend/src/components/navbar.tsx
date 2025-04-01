"use server"

import { auth } from "@/libs/auth";
import Link from "next/link"
import { Button } from "primereact/button";
import UserMenu from "./userMenu";

export default async function Navbar() {
    const session = await auth();
    return (
        <div className="bg-zinc-100 border-b-2 flex flex-row justify-between items-center p-2">
            <div className="flex flex-row items-center gap-5">
                <Link href="/" passHref>
                    <Button severity="secondary" text label="Section6"/>
                </Link>
                <Link href="/browse?s=" passHref>
                    <Button severity="secondary" text label="Browse"/>
                </Link>
            </div>
            <div>
                {session?.user.id ? (
                    <UserMenu session={session} />
                ) : (
                    <Link href="/authorize/signin" passHref>
                        <Button label="Signin"/>
                    </Link>
                )}
            </div>
        </div>
    )
}

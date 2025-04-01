import { auth } from "@/libs/auth"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"

export default auth(async (req) => {
    const { nextUrl } = req
    const session = req.auth

    // Paths that require authentication
    if (nextUrl.pathname.startsWith("/account")) {
        if (!session) {
            return NextResponse.redirect(new URL("/authorize/signin", req.url))
        }
    }

    if (nextUrl.pathname.startsWith("/viewer")) {
        if (!session) {
            return NextResponse.redirect(new URL("/authorize/signin", req.url))
        }
    }

    // Paths that must be inaccessible after login
    if (nextUrl.pathname.startsWith("/authorize")) {
        if (session) {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }


    // Paths that require authentication + admin role
    if (nextUrl.pathname.startsWith("/dashboard")) {
        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image!.*\\.png$).*)"],
}
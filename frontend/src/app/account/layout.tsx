import AccountSidebar from "@/components/account/sidebar";

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex min-h-[calc(100vh-5rem)] p-5 gap-5">
            <AccountSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
'use client';

import { Menu } from "primereact/menu";

export default function AccountSidebar() {
    const navItems = [
        {
            label: 'profile',
            icon: 'pi pi-user',
            url: '/account/profile'
        },
        {
            label: 'my purchases',
            icon: 'pi pi-map',
            url: '/account/purchases'
        },
        {
            label: 'transactions',
            icon: 'pi pi-receipt',
            url: '/account/transactions'
        }
    ]
    return (
        <Menu className="min-h-full" model={navItems} />
    );
}
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
    // const navItems = [
    //     {
    //         label: "data",
    //         items: [
    //             {
    //                 label: 'resource',
    //                 icon: 'pi pi-folder',
    //                 url: '/dashboard/resources'
    //             },
    //             {
    //                 label: 'cluster',
    //                 icon: 'pi pi-objects-column',
    //                 url: '/dashboard/cluster'
    //             },

    //         ]
    //     },
    //     {
    //         label: "segmented",
    //         items: [

    //         ]
    //     },
    //     {
    //         label: "user",
    //         items: [
    //             {
    //                 label: 'users',
    //                 icon: 'pi pi-user-edit',
    //                 url: '/dashboard/users'
    //             },
    //         ]
    //     }
    // ]
    return (
        <Menu className="min-h-full" model={navItems} />
    );
}
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
            label: 'purchases',
            icon: 'pi pi-receipt',
            url: '/account/purchases'
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
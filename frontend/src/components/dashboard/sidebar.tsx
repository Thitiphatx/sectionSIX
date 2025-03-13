'use client';

import { Menu } from "primereact/menu";

export default function DashboardSidebar() {
	const navItems = [
		{
			label: "data",
			items: [
				{
					label: 'resource',
					icon: 'pi pi-folder',
					url: '/dashboard/resources'
				},
				{
					label: 'cluster',
					icon: 'pi pi-objects-column',
					url: '/dashboard/cluster'
				},

			]
		},
        {
            label: "segmented",
            items: [

            ]
        },
        {
            label: "user",
            items: [
				{
					label: 'users',
					icon: 'pi pi-user-edit',
					url: '/dashboard/users'
				},
            ]
        }
	]
    return (
        <Menu className="min-h-full" model={navItems} />
    );
}
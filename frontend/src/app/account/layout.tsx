import { PanelMenu } from "primereact/panelmenu";

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

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-row">
            <div className="w-1/6">
            <PanelMenu model={navItems} />
            </div>
            <div className="w-5/6">
                {children}
            </div>
        </div>
    );
}
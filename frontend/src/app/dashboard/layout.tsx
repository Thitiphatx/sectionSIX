import DashboardSidebar from "@/components/dashboard/sidebar";


export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {

	return (
		<div className="flex min-h-[calc(100vh-5rem)] p-5 gap-5">
			<DashboardSidebar/>
			<div className="flex-1">
				{children}
			</div>
		</div>
	);
}
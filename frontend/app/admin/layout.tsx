import Sidebar from '../../components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar handles its own mobile/desktop display */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pt-20 md:pt-8 px-4 md:px-8 pb-8">
                {children}
            </main>
        </div>
    );
}
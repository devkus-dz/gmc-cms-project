import Sidebar from '../../components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar handles its own mobile/desktop display */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                {children}
            </main>
        </div>
    );
}

import { PropsWithChildren } from 'react';
import { Sidebar } from '@/components/admin/sidebar'; // to be created

export default function AdminLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex h-screen overflow-hidden">
            <aside className="w-64 hidden md:block border-r bg-muted/40">
                <Sidebar />
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}

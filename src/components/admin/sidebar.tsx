"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/(auth)/actions';

const items = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: Package,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingBag,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span>Nesh Admin</span>
                </Link>
            </div>
            <div className="flex-1 py-6 px-4">
                <nav className="space-y-2">
                    {items.map((item) => (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === item.url ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}

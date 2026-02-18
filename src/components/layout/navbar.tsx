"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Smartphone, User as UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { CartSheet } from "@/components/shop/cart-sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type User } from "@supabase/supabase-js"
import { logout } from "@/app/(auth)/actions"

interface NavbarProps {
    user: User | null
}

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname()
    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/shop",
            label: "Shop",
            active: pathname === "/shop",
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 md:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <Smartphone className="h-6 w-6" />
                            <span>Nesh Tech</span>
                        </Link>
                        <nav className="flex flex-col gap-4 mt-8">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${route.active ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <Link href="/" className="mr-6 hidden md:flex items-center gap-2 font-bold text-xl">
                    <Smartphone className="h-6 w-6" />
                    <span>Nesh Tech</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`transition-colors hover:text-foreground/80 ${route.active ? "text-foreground" : "text-foreground/60"
                                }`}
                        >
                            {route.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        <CartSheet />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">Orders</Link>
                                    </DropdownMenuItem>
                                    {user.email === 'admin@neshtech.com' && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">Dashboard</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <UserIcon className="h-6 w-6" />
                                        <span className="sr-only">User</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/login">Login</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/signup">Sign Up</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                    </nav>
                </div>
            </div>
        </header>
    )
}

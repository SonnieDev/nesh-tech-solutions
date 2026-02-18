import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} Nesh Tech Solutions. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                </div>
            </div>
        </footer>
    )
}

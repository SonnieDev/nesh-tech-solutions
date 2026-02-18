import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signup } from "../actions"

export default function SignupPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to track your orders and checkout faster.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signup} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" name="full_name" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button className="w-full">Create account</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-center w-full">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">Login</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

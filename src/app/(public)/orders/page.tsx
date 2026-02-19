
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Clock } from "lucide-react";

export default async function OrdersPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, product_variants(*, products(*)))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container py-10 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {!orders || orders.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No orders found</CardTitle>
                        <CardDescription>You haven't placed any orders yet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/shop" className="text-primary hover:underline">
                            Start Shopping
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader className="bg-muted/30">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                    <div>
                                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                        <span className="font-bold">KES {order.total_amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.order_items.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-medium">
                                                            {item.product_variants.products.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ({item.product_variants.color_name})
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">KES {item.unit_price.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

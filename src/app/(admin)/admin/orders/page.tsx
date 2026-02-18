
import { createClient } from '@/lib/supabase/server';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';

export default async function AdminOrdersPage() {
    const supabase = await createClient();
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Orders</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                                <TableCell>{order.customer_name}</TableCell>
                                <TableCell>{order.customer_phone}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        order.status === 'confirmed' ? 'default' :
                                            order.status === 'delivered' ? 'secondary' : 'outline'
                                    }>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">KES {order.total_amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Icon } from "../../../components/icons/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../components/ui/DropdownMenu';
import { Checkbox } from '../../../components/ui/Checkbox';
import { formatCurrency } from '../../../lib/utils';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { DatePicker } from '../../../components/ui/DatePicker';
import type { SalesOrder } from '../../../types';
import type { DateRange } from '../../../components/ui/Calendar';

interface SalesOrdersTabProps {
    orders: SalesOrder[];
    onCreate: () => void;
}

const SalesOrdersTab: React.FC<SalesOrdersTabProps> = ({ orders, onCreate }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-1/3">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search orders by ID or customer..." className="pl-10" />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-[220px]">
                            <DatePicker 
                                mode="range"
                                value={dateRange}
                                onChange={setDateRange}
                                placeholder="Filter by Date"
                            />
                        </div>
                        <Button variant="outline">
                            Filters
                        </Button>
                        <Button onClick={onCreate}>
                            <Icon name="plus" className="h-4 w-4 mr-2" />
                            Create Sales Order
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"><Checkbox /></TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell><Checkbox /></TableCell>
                                <TableCell className="font-medium text-blue-500 cursor-pointer hover:underline">{order.id}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.orderDate}</TableCell>
                                <TableCell className="text-center">{order.itemCount}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                                <TableCell><StatusBadge status={order.status} /></TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><Icon name="moreVertical" className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Convert to Invoice</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default SalesOrdersTab;

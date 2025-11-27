
import React from 'react';
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { ReturnRequest } from '../../../types';

interface ReturnsRefundsTabProps {
    returns: ReturnRequest[];
}

const ReturnsRefundsTab: React.FC<ReturnsRefundsTabProps> = ({ returns }) => {
    return (
        <Card>
            <CardHeader>
                <p className="text-gray-500 dark:text-gray-400">Manage customer return requests for refunds or exchanges.</p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Return ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {returns.map((ret) => (
                            <TableRow key={ret.id}>
                                <TableCell className="font-medium">{ret.id}</TableCell>
                                <TableCell className="text-blue-500 hover:underline cursor-pointer">{ret.orderId}</TableCell>
                                <TableCell>{ret.customerName}</TableCell>
                                <TableCell>{ret.reason}</TableCell>
                                <TableCell>{ret.type}</TableCell>
                                <TableCell><StatusBadge status={ret.status} /></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Process Return</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ReturnsRefundsTab;

import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Icon } from "../../components/icons/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { formatCurrency } from "../../lib/utils";

import SalesOrdersTab from './orders/SalesOrdersTab';
import PurchaseOrdersTab from './orders/PurchaseOrdersTab';
import ReturnsRefundsTab from './orders/ReturnsRefundsTab';
import ShippingFulfillmentTab from './orders/ShippingFulfillmentTab';

import CreateSalesOrderModal from "../../components/modals/CreateSalesOrderModal";
import CreatePurchaseOrderModal from "../../components/modals/CreatePurchaseOrderModal";

import { mockSalesOrders, mockPurchaseOrders, mockReturns, mockShipping } from "../../data/ordersMockData";
import type { SalesOrder, PurchaseOrder, ReturnRequest, ShippingInfo } from "../../types";

const OrdersManagementPage = () => {
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [returns, setReturns] = useState<ReturnRequest[]>(mockReturns);
    const [shipping, setShipping] = useState<ShippingInfo[]>(mockShipping);
    
    const [isCreateSalesOrderOpen, setCreateSalesOrderOpen] = useState(false);
    const [isCreatePurchaseOrderOpen, setCreatePurchaseOrderOpen] = useState(false);
    
    const stats = [
        { label: "Pending Orders", value: salesOrders.filter(o => o.status === 'Pending').length, icon: 'clock' as const, color: "text-yellow-500" },
        { label: "To Ship", value: shipping.filter(s => s.status === 'Packed').length, icon: 'package' as const, color: "text-blue-500" },
        { label: "Completed Orders", value: salesOrders.filter(o => o.status === 'Completed').length, icon: 'checkCircle' as const, color: "text-green-500" },
        { label: "Returns Requested", value: returns.filter(r => r.status === 'Requested').length, icon: 'refreshCw' as const, color: "text-red-500" },
    ];

    const handleCreateSalesOrder = (newOrder: SalesOrder) => {
        setSalesOrders(prev => [newOrder, ...prev]);
        setCreateSalesOrderOpen(false);
    };

    const handleCreatePurchaseOrder = (newPO: PurchaseOrder) => {
        setPurchaseOrders(prev => [newPO, ...prev]);
        setCreatePurchaseOrderOpen(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Track and manage all your sales, purchases, returns, and fulfillment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>
                                    <Icon name={stat.icon} className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="sales">
                <TabsList>
                    <TabsTrigger value="sales">Sales Orders</TabsTrigger>
                    <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
                    <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping & Fulfillment</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="mt-6">
                    <SalesOrdersTab orders={salesOrders} onCreate={() => setCreateSalesOrderOpen(true)} />
                </TabsContent>
                <TabsContent value="purchase" className="mt-6">
                    <PurchaseOrdersTab orders={purchaseOrders} onCreate={() => setCreatePurchaseOrderOpen(true)} />
                </TabsContent>
                <TabsContent value="returns" className="mt-6">
                    <ReturnsRefundsTab returns={returns} />
                </TabsContent>
                <TabsContent value="shipping" className="mt-6">
                    <ShippingFulfillmentTab shippingInfo={shipping} />
                </TabsContent>
            </Tabs>

            {isCreateSalesOrderOpen && (
                <CreateSalesOrderModal 
                    isOpen={isCreateSalesOrderOpen}
                    onClose={() => setCreateSalesOrderOpen(false)}
                    onSave={handleCreateSalesOrder}
                />
            )}
            {isCreatePurchaseOrderOpen && (
                <CreatePurchaseOrderModal
                    isOpen={isCreatePurchaseOrderOpen}
                    onClose={() => setCreatePurchaseOrderOpen(false)}
                    onSave={handleCreatePurchaseOrder}
                />
            )}
        </div>
    );
};

export default OrdersManagementPage;
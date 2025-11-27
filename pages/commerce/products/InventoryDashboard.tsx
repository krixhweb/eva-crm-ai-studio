
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/icons/Icon";
import { formatCurrency, getStockStatus } from "../../../lib/utils";
import type { Product } from "../../../types";
import { mockSuppliers } from "../../../data/inventoryMockData";

export const InventoryDashboard = ({ products, onReorder }: { products: Product[], onReorder: (product: Product) => void }) => {
    
    const stats = useMemo(() => {
        const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
        const lowStock = products.filter(p => getStockStatus(p.stock, 20).text === 'Low Stock').length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const fastMoving = products.sort((a,b) => b.stock - a.stock)[0]?.name || 'N/A';
        return { totalValue, lowStock, outOfStock, fastMoving };
    }, [products]);

    return (
        <div className="space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Inventory Value</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Out of Stock</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Fastest Moving</CardTitle></CardHeader><CardContent><p className="text-lg font-bold truncate">{stats.fastMoving}</p></CardContent></Card>
            </div>

            {/* Low Stock Alerts */}
            <Card>
                <CardHeader><CardTitle className="text-yellow-600 flex items-center gap-2"><Icon name="alertTriangle" /> Low Stock Alerts</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {products.filter(p => p.stock < 20).map(p => (
                            <div key={p.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                {p.images[0] ? 
                                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-md object-cover" /> :
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center"><Icon name="image" className="w-6 h-6 text-gray-300"/></div>
                                }
                                <div className="flex-grow">
                                    <p className="font-medium">{p.name}</p>
                                    <p className="text-xs text-gray-500">Supplier: {mockSuppliers[0]?.name}</p>
                                </div>
                                <div className="text-right mr-4">
                                    <p className="text-sm font-bold text-red-600">{p.stock} left</p>
                                    <p className="text-xs text-gray-500">Reorder Level: 20</p>
                                </div>
                                <Button size="sm" onClick={() => onReorder(p)}>Reorder</Button>
                            </div>
                        ))}
                        {products.filter(p => p.stock < 20).length === 0 && (
                            <div className="text-center text-gray-500 py-4">Inventory levels are healthy.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

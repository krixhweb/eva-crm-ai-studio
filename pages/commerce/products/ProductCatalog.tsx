
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Icon } from "../../../components/icons/Icon";
import { getStockStatus } from "../../../lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/Table";
import type { Product } from "../../../types";

export const ProductCatalog = ({ products }: { products: Product[] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.sku.toLowerCase().includes(lower)
        );
    }, [products, searchTerm]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle>Multi-Location Stock</CardTitle>
                    <div className="relative w-64">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search by name or SKU..." 
                            className="pl-10 h-9" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Warehouse A</TableHead>
                                <TableHead className="text-right">Warehouse B</TableHead>
                                <TableHead className="text-right">Storefront</TableHead>
                                <TableHead className="text-right">Total Stock</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.slice(0, 10).map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">{p.sku}</TableCell>
                                    {p.locations.map(l => <TableCell key={l.locationId} className="text-right">{l.stock}</TableCell>)}
                                    <TableCell className="font-bold text-right">{p.stock}</TableCell>
                                    <TableCell className="text-center"><Badge variant={getStockStatus(p.stock, 20).variant}>{getStockStatus(p.stock, 20).text}</Badge></TableCell>
                                </TableRow>
                            ))}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        No products found matching "{searchTerm}".
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

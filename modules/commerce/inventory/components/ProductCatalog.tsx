
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Icon } from "../../../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../../../components/ui/DropdownMenu";
import type { Product } from "../../../../types";
import { ProductFilterDrawer } from "./ProductFilterDrawer";

export const ProductCatalog = ({ products, onAddProduct }: { products: Product[], onAddProduct: () => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();

    // Simple filter state (in a real app, this would be more complex)
    const [activeFilters, setActiveFilters] = useState({
        categories: [] as string[],
        status: 'All',
        warehouse: 'All',
        dateFrom: '',
        dateTo: ''
    });

    const uniqueCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

    const filteredProducts = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return products.filter(p => {
            // Search
            const matchesSearch = p.name.toLowerCase().includes(lowerSearch) ||
                                  p.sku.toLowerCase().includes(lowerSearch) ||
                                  p.category.toLowerCase().includes(lowerSearch);
            
            // Category Filter
            const matchesCategory = activeFilters.categories.length === 0 || activeFilters.categories.includes(p.category);
            
            // Status Filter
            const matchesStatus = activeFilters.status === 'All' || p.status === activeFilters.status;

            // Warehouse Filter (Check if product has stock in specific warehouse)
            const matchesWarehouse = activeFilters.warehouse === 'All' || p.locations.some(l => l.locationId === activeFilters.warehouse && l.stock > 0);

            return matchesSearch && matchesCategory && matchesStatus && matchesWarehouse;
        });
    }, [products, searchTerm, activeFilters]);

    const activeFilterCount = activeFilters.categories.length + (activeFilters.status !== 'All' ? 1 : 0) + (activeFilters.warehouse !== 'All' ? 1 : 0);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                        <CardTitle>Product Catalog</CardTitle>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="Search products..." 
                                    className="pl-10 h-9" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2 relative" onClick={() => setIsFilterOpen(true)}>
                                <Icon name="list" className="h-4 w-4" />
                                Filter
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                            <Button className="gap-2" onClick={onAddProduct}>
                                <Icon name="plus" className="h-4 w-4" />
                                Add Product
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableHead className="w-[60px]">Image</TableHead>
                                    <TableHead>Product Name & SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Total Stock</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map(p => (
                                    <TableRow 
                                        key={p.id} 
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        onClick={() => navigate(`/commerce/products/${p.id}`)}
                                    >
                                        <TableCell>
                                            <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border dark:border-gray-700">
                                                {p.images[0] ? (
                                                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Icon name="image" className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{p.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">{p.sku}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">{p.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-gray-700 dark:text-gray-300">
                                            {p.stock} units
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={p.status === 'Active' ? 'green' : 'gray'}>{p.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Icon name="moreVertical" className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate(`/commerce/products/${p.id}`)}>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon name="search" className="h-8 w-8 opacity-20" />
                                                <p>No products found matching your filters.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ProductFilterDrawer 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={setActiveFilters}
                categories={uniqueCategories}
            />
        </>
    );
};

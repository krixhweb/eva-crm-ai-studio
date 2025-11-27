
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { InventoryDashboard } from './components/InventoryDashboard';
import { ProductCatalog } from './components/ProductCatalog';
import CreateProductModal from '../../../components/modals/CreateProductModal';
import ReorderModal, { ReplenishmentOrderPayload } from '../../../components/modals/ReorderModal';
import { mockProducts } from '../../../data/inventoryMockData';
import type { Product } from '../../../types';
import { useToast } from '../../../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';

const ProductsInventoryPage: React.FC = () => {
    const { toast } = useToast();
    const location = useLocation();
    const defaultTab = location.state?.defaultTab || 'dashboard';
    
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [reorderProduct, setReorderProduct] = useState<Product | null>(null);

    const handleSaveProduct = (product: Product) => {
        const exists = products.find(p => p.id === product.id);
        if (exists) {
            setProducts(prev => prev.map(p => p.id === product.id ? product : p));
            toast({ title: "Product Updated", description: `${product.name} has been updated.` });
        } else {
            setProducts(prev => [product, ...prev]);
            toast({ title: "Product Created", description: `${product.name} has been added.` });
        }
        setCreateOpen(false);
    };

    const handleReorderSubmit = (orderData: ReplenishmentOrderPayload) => {
        console.log("NEW REPLENISHMENT ORDER", orderData);
        toast({ 
            title: "Purchase Order Created", 
            description: `Order ${orderData.orderId} for ${orderData.productName} initiated.` 
        });
        setReorderProduct(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products & Inventory</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your product catalog and stock levels across locations.</p>
            </div>

            <Tabs key={defaultTab} defaultValue={defaultTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="dashboard">Inventory Dashboard</TabsTrigger>
                    <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    <InventoryDashboard 
                        products={products} 
                        onReorder={setReorderProduct} 
                    />
                </TabsContent>

                <TabsContent value="catalog" className="space-y-6">
                    <ProductCatalog 
                        products={products} 
                        onAddProduct={() => setCreateOpen(true)} 
                    />
                </TabsContent>
            </Tabs>

            <CreateProductModal 
                isOpen={isCreateOpen} 
                onClose={() => setCreateOpen(false)} 
                onSave={handleSaveProduct}
                product={null} 
            />

            {reorderProduct && (
                <ReorderModal 
                    isOpen={!!reorderProduct} 
                    onClose={() => setReorderProduct(null)} 
                    onSubmit={handleReorderSubmit} 
                    product={reorderProduct} 
                />
            )}
        </div>
    );
};

export default ProductsInventoryPage;

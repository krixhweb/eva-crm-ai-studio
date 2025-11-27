
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Icon } from '../icons/Icon';
import { calculateMargin } from '../../lib/utils';
import type { Product } from '../../types';
import { productLocations } from '../../data/inventoryMockData';
import { Badge } from '../ui/Badge';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product?: Product | null;
}

const furnitureCategories = ["Sofa", "Chair", "Table", "Bed", "Wardrobe", "Dining Set", "Shelf", "Decor"];

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        sku: '',
        category: furnitureCategories[0],
        tags: [],
        description: '',
        images: [],
        costPrice: 0,
        sellingPrice: 0,
        status: 'Active',
        locations: productLocations.map(l => ({ locationId: l.id, locationName: l.name, stock: 0 })),
        stock: 0,
    });
    const [tagInput, setTagInput] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    useEffect(() => {
        if (product) {
            setFormData(product);
            setImagePreviews(product.images);
        } else {
            // Auto-generate SKU for new products
            setFormData(prev => ({...prev, sku: `SKU-${Date.now().toString().slice(-6)}` }));
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationStockChange = (locationId: string, stock: number) => {
        const newLocations = formData.locations?.map(l => l.locationId === locationId ? { ...l, stock: isNaN(stock) ? 0 : stock } : l);
        const totalStock = newLocations?.reduce((sum, l) => sum + l.stock, 0);
        setFormData({ ...formData, locations: newLocations, stock: totalStock });
    };

    const addTag = () => {
        if (tagInput && !formData.tags?.includes(tagInput)) {
            setFormData({ ...formData, tags: [...(formData.tags || []), tagInput] });
        }
        setTagInput('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImageUrls = files.map(file => URL.createObjectURL(file as Blob | MediaSource));
            const allPreviews = [...imagePreviews, ...newImageUrls];
            setFormData({...formData, images: allPreviews });
            setImagePreviews(allPreviews);
        }
    };

    const handleSubmit = () => {
        // Basic validation
        if (!formData.name || !formData.sellingPrice) {
            alert('Product Name and Selling Price are required.');
            return;
        }
        onSave({
            id: product?.id || `prod_${Date.now()}`,
            ...formData
        } as Product);
    };
    
    const margin = calculateMargin(formData.costPrice || 0, formData.sellingPrice || 0);

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-w-4xl" resizable>
                <DrawerHeader>
                    <DrawerTitle>{product ? 'Edit Product' : 'Create New Product'}</DrawerTitle>
                    <DrawerDescription>Fill in the details for your product catalog.</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[120px]" />
                            </div>
                            
                            <div>
                                <Label className="mb-2 block">Images</Label>
                                <div className="grid grid-cols-4 gap-3">
                                    {imagePreviews.map((src, i) => <img key={i} src={src} className="w-full h-24 object-cover rounded-md border dark:border-zinc-800" />)}
                                    <label className="w-full h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-green-500 dark:border-zinc-700 transition-colors">
                                        <Icon name="plus" className="text-gray-400" />
                                        <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block">Inventory by Location</Label>
                                <div className="space-y-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border dark:border-zinc-800">
                                    {formData.locations?.map(loc => (
                                        <div key={loc.locationId} className="flex items-center gap-4">
                                            <Label className="w-1/3 text-gray-600 dark:text-gray-400">{loc.locationName}</Label>
                                            <Input type="number" value={loc.stock} onChange={e => handleLocationStockChange(loc.locationId, parseInt(e.target.value))} className="bg-white dark:bg-zinc-900" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border dark:border-zinc-800 space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold">Status</Label>
                                    <Switch checked={formData.status === 'Active'} onClick={() => setFormData({...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active'})} />
                                </div>
                                <p className="text-xs text-gray-500">{formData.status === 'Active' ? 'Visible in your store.' : 'Hidden from your store.'}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{furnitureCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag..." />
                                    <Button variant="outline" onClick={addTag}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {formData.tags?.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="costPrice">Cost</Label>
                                    <Input type="number" id="costPrice" name="costPrice" value={formData.costPrice} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sellingPrice">Price</Label>
                                    <Input type="number" id="sellingPrice" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} />
                                </div>
                            </div>
                            
                            <div className="flex justify-between text-sm pt-2 border-t dark:border-zinc-800">
                                <span className="text-gray-500">Margin</span>
                                <span className={`font-bold ${margin > 0 ? 'text-green-600' : 'text-red-600'}`}>{margin}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Product</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateProductModal;

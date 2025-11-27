
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { mockSuppliers, productLocations } from '../../data/inventoryMockData';
import type { PurchaseOrder } from '../../types';
import { DatePicker } from '../ui/DatePicker';

interface CreatePurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (po: PurchaseOrder) => void;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({ isOpen, onClose, onSave }) => {
    const [expectedDelivery, setExpectedDelivery] = React.useState<string>('');

    const handleSave = () => {
        const newPO: PurchaseOrder = {
            id: `PO-${Date.now().toString().slice(-4)}`,
            supplierName: mockSuppliers[0].name,
            createdDate: new Date().toISOString().split('T')[0],
            expectedDelivery: expectedDelivery || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            totalCost: 150000, // Mocked total
            status: 'Draft',
        };
        onSave(newPO);
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-w-md" resizable>
                <DrawerHeader>
                    <DrawerTitle>Create Purchase Order</DrawerTitle>
                    <DrawerDescription>Create a new PO to order stock from a supplier.</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Supplier</Label>
                        <Select defaultValue={mockSuppliers[0].id}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expected Delivery</Label>
                            <DatePicker
                                value={expectedDelivery ? new Date(expectedDelivery) : null}
                                onChange={(d) => setExpectedDelivery(d ? d.toISOString().split('T')[0] : '')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Delivery Location</Label>
                            <Select defaultValue={productLocations[0].id}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{productLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Optional: add any notes for this PO..." className="min-h-[100px]" />
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save PO</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default CreatePurchaseOrderModal;

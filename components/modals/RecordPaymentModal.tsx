
import React, { useState, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { formatCurrency, validatePayment } from '../../lib/utils';
import { useToast } from '../../hooks/use-toast';
import type { Invoice, Payment } from '../../types';

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payment: Payment) => void;
    invoice: Invoice;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, onSave, invoice }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<Partial<Payment>>({
        amount: invoice.balance,
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'Bank Transfer',
        notes: '',
    });
    
    const validationError = useMemo(() => validatePayment(formData, invoice.balance), [formData, invoice.balance]);

    const handleSave = () => {
        if (validationError) {
            toast({ title: "Validation Error", description: validationError, variant: 'destructive' });
            return;
        }
        const newPayment: Payment = {
            id: `PAY-${Date.now().toString().slice(-6)}`,
            invoiceId: invoice.id,
            customerId: invoice.customerId,
            customerName: invoice.customerName,
            status: 'Completed',
            ...formData,
        } as Payment;
        onSave(newPayment);
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-w-md">
                <DrawerHeader>
                    <DrawerTitle>Record Payment for Invoice {invoice.id}</DrawerTitle>
                    <DrawerDescription>Balance due: {formatCurrency(invoice.balance)}</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input type="number" value={formData.amount} onChange={e => setFormData(p => ({...p, amount: parseFloat(e.target.value)}))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select value={formData.method} onValueChange={v => setFormData(p => ({...p, method: v as any}))}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Input type="date" value={formData.paymentDate} onChange={e => setFormData(p => ({...p, paymentDate: e.target.value}))}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={formData.notes} onChange={e => setFormData(p => ({...p, notes: e.target.value}))} className="min-h-[100px]" />
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!!validationError}>Record Payment</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default RecordPaymentModal;


import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Customer } from '../../types';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '../ui/Drawer';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface EditCustomerModalProps {
  customer: Customer;
  onSave: (customer: Customer) => void;
  onClose: () => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState<Customer>(customer);

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof Customer, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Drawer open={true} onOpenChange={onClose}>
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Edit Customer</DrawerTitle>
        </DrawerHeader>
        
        <form id="edit-customer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
            >
                <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </form>

        <DrawerFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="edit-customer-form">Save Changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditCustomerModal;

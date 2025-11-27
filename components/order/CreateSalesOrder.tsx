
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Icon } from '../icons/Icon';
import { formatCurrency, cn } from '../../lib/utils';
import { mockCustomers } from '../../data/mockData';
import { mockProducts } from '../../data/inventoryMockData';
import type { Customer, Product, SalesOrder } from '../../types';

// --- TYPES ---

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface LineItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  taxRate: number;
  total: number;
}

interface SalesOrderState {
  owner: string;
  subject: string;
  dueDate: Date | undefined;
  contactName: string;
  status: string;
  carrier: string;
}

interface CreateSalesOrderProps {
  onClose?: () => void;
  onSave?: (order: SalesOrder) => void;
  initialData?: Partial<SalesOrder>;
}

// --- MAIN COMPONENT ---

export default function CreateSalesOrder({ onClose, onSave, initialData }: CreateSalesOrderProps) {
  // --- STATE: Customer ---
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerHighlightIndex, setCustomerHighlightIndex] = useState(0);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  // --- STATE: Order Info ---
  const [orderInfo, setOrderInfo] = useState<SalesOrderState>({
    owner: "Current User",
    subject: "",
    dueDate: new Date(),
    contactName: "",
    status: "Draft",
    carrier: "",
  });

  // --- STATE: Addresses ---
  const [billingAddress, setBillingAddress] = useState<Address>({ street: '', city: '', province: '', postalCode: '', country: '' });
  const [shippingAddress, setShippingAddress] = useState<Address>({ street: '', city: '', province: '', postalCode: '', country: '' });

  // --- STATE: Products ---
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [productSearchOpen, setProductSearchOpen] = useState<string | null>(null); // ID of the row being searched

  // --- STATE: Summary ---
  const [discount, setDiscount] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [notes, setNotes] = useState("");

  // --- STATE: Validation Errors ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- EFFECTS ---

  // Sync customer address when selected
  useEffect(() => {
    if (selectedCustomer) {
      setOrderInfo(prev => ({ ...prev, contactName: selectedCustomer.name }));
      setBillingAddress({
        street: selectedCustomer.address.street,
        city: selectedCustomer.address.city,
        province: selectedCustomer.address.state,
        postalCode: selectedCustomer.address.postalCode,
        country: 'India' // Default for mock
      });
      // Auto copy to shipping for convenience
      setShippingAddress({
        street: selectedCustomer.address.street,
        city: selectedCustomer.address.city,
        province: selectedCustomer.address.state,
        postalCode: selectedCustomer.address.postalCode,
        country: 'India'
      });
      // Clear customer error if selected
      if (errors.customer) setErrors(prev => ({ ...prev, customer: '' }));
    }
  }, [selectedCustomer]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node) && !customerInputRef.current?.contains(event.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- CALCULATIONS ---

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxTotal = lineItems.reduce((acc, item) => acc + ((item.price * item.quantity) * (item.taxRate / 100)), 0);
    const grandTotal = subtotal + taxTotal + shippingCharges - discount;
    return { subtotal, taxTotal, grandTotal };
  }, [lineItems, discount, shippingCharges]);

  // --- VALIDATION ---

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Customer Validation
    if (!selectedCustomer) newErrors.customer = "Customer is required.";

    // Order Info Validation
    if (!orderInfo.subject.trim()) newErrors.subject = "Subject is required.";
    if (!orderInfo.dueDate) newErrors.dueDate = "Due Date is required.";
    if (!orderInfo.status) newErrors.status = "Status is required.";

    // Product Validation
    if (lineItems.length === 0) newErrors.lineItems = "Please add at least one product to continue.";

    // Billing Address Validation
    if (!billingAddress.street.trim()) newErrors.billingStreet = "Street is required.";
    if (!billingAddress.city.trim()) newErrors.billingCity = "City is required.";
    if (!billingAddress.province.trim()) newErrors.billingProvince = "Province is required.";
    if (!billingAddress.postalCode.trim()) newErrors.billingPostalCode = "Postal Code is required.";
    if (!billingAddress.country.trim()) newErrors.billingCountry = "Country is required.";

    // Shipping Address Validation
    if (!shippingAddress.street.trim()) newErrors.shippingStreet = "Street is required.";
    if (!shippingAddress.city.trim()) newErrors.shippingCity = "City is required.";
    if (!shippingAddress.province.trim()) newErrors.shippingProvince = "Province is required.";
    if (!shippingAddress.postalCode.trim()) newErrors.shippingPostalCode = "Postal Code is required.";
    if (!shippingAddress.country.trim()) newErrors.shippingCountry = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HANDLERS: Customer ---

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return mockCustomers;
    const lower = customerSearch.toLowerCase();
    return mockCustomers.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.email.toLowerCase().includes(lower) ||
      c.phone.includes(lower)
    );
  }, [customerSearch]);

  const handleCustomerKeyDown = (e: React.KeyboardEvent) => {
    if (!isCustomerDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsCustomerDropdownOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCustomerHighlightIndex(prev => (prev + 1) % filteredCustomers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCustomerHighlightIndex(prev => (prev - 1 + filteredCustomers.length) % filteredCustomers.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCustomers[customerHighlightIndex]) {
        selectCustomer(filteredCustomers[customerHighlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCustomerDropdownOpen(false);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setIsCustomerDropdownOpen(false);
  };

  // --- HANDLERS: Address ---

  const copyBillingToShipping = () => {
    setShippingAddress({ ...billingAddress });
    // Clear shipping errors if they match billing (assuming billing is valid or user will fix)
    // A more robust way would be to re-validate, but this is a quick action.
    if (billingAddress.street) setErrors(prev => ({...prev, shippingStreet: ''}));
    if (billingAddress.city) setErrors(prev => ({...prev, shippingCity: ''}));
    if (billingAddress.province) setErrors(prev => ({...prev, shippingProvince: ''}));
    if (billingAddress.postalCode) setErrors(prev => ({...prev, shippingPostalCode: ''}));
    if (billingAddress.country) setErrors(prev => ({...prev, shippingCountry: ''}));
  };

  // --- HANDLERS: Products ---

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: "",
      name: "",
      sku: "",
      price: 0,
      quantity: 1,
      taxRate: 0,
      total: 0
    };
    setLineItems([...lineItems, newItem]);
    if (errors.lineItems) setErrors(prev => ({ ...prev, lineItems: '' }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Auto calc total if price/qty changes
        if (field === 'price' || field === 'quantity') {
          updated.total = updated.price * updated.quantity;
        }
        return updated;
      }
      return item;
    }));
  };

  const selectProduct = (id: string, product: Product) => {
    updateLineItem(id, 'productId', product.id);
    updateLineItem(id, 'name', product.name);
    updateLineItem(id, 'sku', product.sku);
    updateLineItem(id, 'price', product.sellingPrice);
    updateLineItem(id, 'taxRate', 18); // Default tax
    updateLineItem(id, 'total', product.sellingPrice * 1);
    setProductSearchOpen(null);
  };

  // --- HANDLERS: Save ---

  const handleSave = () => {
    if (!validate()) {
      // Scroll to top or first error could be added here
      return;
    }

    const newOrder: SalesOrder = {
      id: initialData?.id || `SO-${Date.now().toString().slice(-6)}`,
      customerName: selectedCustomer!.name,
      orderDate: new Date().toISOString().split('T')[0],
      itemCount: lineItems.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: totals.subtotal,
      taxes: totals.taxTotal,
      totalAmount: totals.grandTotal,
      status: orderInfo.status as any,
    };
    
    if (onSave) onSave(newOrder);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Sales Order</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to create a new sales order.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={handleSave} className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">Save as Draft</Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">Save</Button>
        </div>
      </div>

      {/* --- MAIN CONTENT SCROLLABLE --- */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (Main Info) */}
          <div className="col-span-12 xl:col-span-9 space-y-6">
            
            {/* SECTION 1: CUSTOMER SELECTOR */}
            <Card className="overflow-visible z-20">
              <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
              <CardContent>
                <div className="relative">
                  <Label className="mb-2 block">Customer Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      ref={customerInputRef}
                      placeholder="Type to search customers..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setIsCustomerDropdownOpen(true);
                        if (!e.target.value) setSelectedCustomer(null);
                      }}
                      onFocus={() => setIsCustomerDropdownOpen(true)}
                      onKeyDown={handleCustomerKeyDown}
                      className={cn("pl-10", errors.customer && "border-red-500 focus-visible:ring-red-500")}
                    />
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {isCustomerDropdownOpen && (
                      <div ref={customerDropdownRef} className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                        {filteredCustomers.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">No customers found.</div>
                        ) : (
                          filteredCustomers.map((c, idx) => (
                            <div
                              key={c.id}
                              className={`px-4 py-3 cursor-pointer flex justify-between items-center text-sm ${idx === customerHighlightIndex ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                              onMouseEnter={() => setCustomerHighlightIndex(idx)}
                              onClick={() => selectCustomer(c)}
                            >
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                                <div className="text-xs text-gray-500">{c.email}</div>
                              </div>
                              <div className="text-xs text-gray-400">{c.phone}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: SALES ORDER INFO */}
            <Card>
              <CardHeader><CardTitle>Sales Order Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Left Col */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Sales Order Owner</Label>
                        <Select value={orderInfo.owner} onValueChange={(v) => setOrderInfo({...orderInfo, owner: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Current User">Current User</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Subject <span className="text-red-500">*</span></Label>
                        <Input 
                            value={orderInfo.subject} 
                            onChange={(e) => {
                                setOrderInfo({...orderInfo, subject: e.target.value});
                                if (e.target.value.trim()) setErrors(prev => ({ ...prev, subject: '' }));
                            }} 
                            placeholder="e.g. Q3 Furniture Order" 
                            className={cn(errors.subject && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label>Due Date <span className="text-red-500">*</span></Label>
                        <div className={cn(errors.dueDate && "border-red-500 rounded-md")}>
                            <DatePicker 
                                value={orderInfo.dueDate || null} 
                                onChange={(d) => {
                                    setOrderInfo({...orderInfo, dueDate: d});
                                    if (d) setErrors(prev => ({ ...prev, dueDate: '' }));
                                }} 
                            />
                        </div>
                        {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
                    </div>
                  </div>
                  {/* Right Col */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Contact Name</Label>
                        <Input value={orderInfo.contactName} onChange={(e) => setOrderInfo({...orderInfo, contactName: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Status <span className="text-red-500">*</span></Label>
                        <Select value={orderInfo.status} onValueChange={(v) => setOrderInfo({...orderInfo, status: v})}>
                            <SelectTrigger className={cn(errors.status && "border-red-500 focus:ring-red-500")}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Sent">Sent</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label>Carrier</Label>
                        <Select value={orderInfo.carrier} onValueChange={(v) => setOrderInfo({...orderInfo, carrier: v})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Carrier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FedEx">FedEx</SelectItem>
                                <SelectItem value="DHL">DHL</SelectItem>
                                <SelectItem value="UPS">UPS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: ADDRESS INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Billing Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Input 
                        placeholder="Billing Street *" 
                        value={billingAddress.street} 
                        onChange={(e) => {
                            setBillingAddress({...billingAddress, street: e.target.value});
                            if(e.target.value) setErrors(prev => ({...prev, billingStreet: ''}));
                        }}
                        className={cn(errors.billingStreet && "border-red-500 focus-visible:ring-red-500")}
                    />
                    {errors.billingStreet && <p className="text-xs text-red-500">{errors.billingStreet}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Input 
                            placeholder="City *" 
                            value={billingAddress.city} 
                            onChange={(e) => {
                                setBillingAddress({...billingAddress, city: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, billingCity: ''}));
                            }}
                            className={cn(errors.billingCity && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.billingCity && <p className="text-xs text-red-500">{errors.billingCity}</p>}
                    </div>
                    <div className="space-y-1">
                        <Input 
                            placeholder="State/Province *" 
                            value={billingAddress.province} 
                            onChange={(e) => {
                                setBillingAddress({...billingAddress, province: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, billingProvince: ''}));
                            }}
                            className={cn(errors.billingProvince && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.billingProvince && <p className="text-xs text-red-500">{errors.billingProvince}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Input 
                            placeholder="Postal Code *" 
                            value={billingAddress.postalCode} 
                            onChange={(e) => {
                                setBillingAddress({...billingAddress, postalCode: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, billingPostalCode: ''}));
                            }}
                            className={cn(errors.billingPostalCode && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.billingPostalCode && <p className="text-xs text-red-500">{errors.billingPostalCode}</p>}
                    </div>
                    <div className="space-y-1">
                        <Input 
                            placeholder="Country *" 
                            value={billingAddress.country} 
                            onChange={(e) => {
                                setBillingAddress({...billingAddress, country: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, billingCountry: ''}));
                            }}
                            className={cn(errors.billingCountry && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.billingCountry && <p className="text-xs text-red-500">{errors.billingCountry}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Shipping Information</CardTitle>
                    <Button variant="ghost" size="sm" onClick={copyBillingToShipping} className="text-xs h-8"><Icon name="copy" className="w-3 h-3 mr-1" /> Copy Billing</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Input 
                        placeholder="Shipping Street *" 
                        value={shippingAddress.street} 
                        onChange={(e) => {
                            setShippingAddress({...shippingAddress, street: e.target.value});
                            if(e.target.value) setErrors(prev => ({...prev, shippingStreet: ''}));
                        }}
                        className={cn(errors.shippingStreet && "border-red-500 focus-visible:ring-red-500")}
                    />
                    {errors.shippingStreet && <p className="text-xs text-red-500">{errors.shippingStreet}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Input 
                            placeholder="City *" 
                            value={shippingAddress.city} 
                            onChange={(e) => {
                                setShippingAddress({...shippingAddress, city: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, shippingCity: ''}));
                            }}
                            className={cn(errors.shippingCity && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.shippingCity && <p className="text-xs text-red-500">{errors.shippingCity}</p>}
                    </div>
                    <div className="space-y-1">
                        <Input 
                            placeholder="State/Province *" 
                            value={shippingAddress.province} 
                            onChange={(e) => {
                                setShippingAddress({...shippingAddress, province: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, shippingProvince: ''}));
                            }}
                            className={cn(errors.shippingProvince && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.shippingProvince && <p className="text-xs text-red-500">{errors.shippingProvince}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Input 
                            placeholder="Postal Code *" 
                            value={shippingAddress.postalCode} 
                            onChange={(e) => {
                                setShippingAddress({...shippingAddress, postalCode: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, shippingPostalCode: ''}));
                            }}
                            className={cn(errors.shippingPostalCode && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.shippingPostalCode && <p className="text-xs text-red-500">{errors.shippingPostalCode}</p>}
                    </div>
                    <div className="space-y-1">
                        <Input 
                            placeholder="Country *" 
                            value={shippingAddress.country} 
                            onChange={(e) => {
                                setShippingAddress({...shippingAddress, country: e.target.value});
                                if(e.target.value) setErrors(prev => ({...prev, shippingCountry: ''}));
                            }}
                            className={cn(errors.shippingCountry && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.shippingCountry && <p className="text-xs text-red-500">{errors.shippingCountry}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SECTION 4: PRODUCTS TABLE */}
            <Card className={cn("overflow-visible", errors.lineItems ? "border-red-500 ring-1 ring-red-500" : "")}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Ordered Items <span className="text-red-500">*</span></CardTitle>
                  <Button onClick={addLineItem} size="sm" variant="outline" className="border-dashed border-gray-300 text-gray-600 hover:text-green-600 hover:border-green-500">
                    <Icon name="plus" className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-visible">
                <div className="border rounded-lg overflow-visible dark:border-zinc-800">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium text-gray-500 w-12">#</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Product Name</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-500 w-32">Price</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-500 w-24">Qty</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-500 w-24">Tax %</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-500 w-32">Total</th>
                        <th className="py-3 px-4 text-center font-medium text-gray-500 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-800">
                      {lineItems.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-400">
                            {errors.lineItems ? <span className="text-red-500 font-medium">{errors.lineItems}</span> : "Add products to start building the order."}
                          </td>
                        </tr>
                      )}
                      {lineItems.map((item, idx) => (
                        <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                          <td className="py-2 px-4 text-gray-400">{idx + 1}</td>
                          <td className="py-2 px-4 relative">
                            {/* Product Search Input */}
                            <div className="relative">
                              <Input 
                                value={item.name}
                                placeholder="Search product..."
                                onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                                onFocus={() => setProductSearchOpen(item.id)}
                                className="border-none shadow-none bg-transparent focus:ring-0 px-0 font-medium"
                              />
                              {productSearchOpen === item.id && (
                                <div className="absolute top-full left-0 w-full min-w-[300px] mt-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-md shadow-xl z-50 max-h-48 overflow-y-auto">
                                  {mockProducts.filter(p => p.name.toLowerCase().includes(item.name.toLowerCase())).map(p => (
                                    <div 
                                      key={p.id} 
                                      className="px-4 py-2 hover:bg-green-50 dark:hover:bg-zinc-800 cursor-pointer flex justify-between items-center"
                                      onClick={() => selectProduct(item.id, p)}
                                    >
                                      <span className="text-sm">{p.name}</span>
                                      <span className="text-xs font-mono text-gray-500">{formatCurrency(p.sellingPrice)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <Input 
                              type="number" 
                              value={item.price} 
                              onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value))} 
                              className="text-right border-transparent bg-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-green-500 h-8" 
                            />
                          </td>
                          <td className="py-2 px-4">
                            <Input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value))} 
                              className="text-right border-transparent bg-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-green-500 h-8" 
                            />
                          </td>
                          <td className="py-2 px-4">
                            <Input 
                              type="number" 
                              value={item.taxRate} 
                              onChange={(e) => updateLineItem(item.id, 'taxRate', parseFloat(e.target.value))} 
                              className="text-right border-transparent bg-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-green-500 h-8" 
                            />
                          </td>
                          <td className="py-2 px-4 text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                          <td className="py-2 px-4 text-center">
                            <button onClick={() => removeLineItem(item.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon name="close" className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 6: NOTES */}
            <Card>
              <CardHeader><CardTitle>Notes & Terms</CardTitle></CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter notes for the customer or internal team..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  className="min-h-[100px]" 
                />
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN (Sticky Summary) */}
          <div className="col-span-12 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-md border-t-4 border-t-green-500">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                    <span className="font-medium">{formatCurrency(totals.taxTotal)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Discount</span>
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                      <Input 
                        type="number" 
                        value={discount} 
                        onChange={(e) => setDiscount(parseFloat(e.target.value))} 
                        className="h-7 pl-5 text-right text-sm" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Shipping</span>
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                      <Input 
                        type="number" 
                        value={shippingCharges} 
                        onChange={(e) => setShippingCharges(parseFloat(e.target.value))} 
                        className="h-7 pl-5 text-right text-sm" 
                      />
                    </div>
                  </div>

                  <div className="border-t dark:border-zinc-800 my-4 pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-gray-900 dark:text-gray-100">Grand Total</span>
                      <span className="text-xl font-bold text-green-600">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="border-t dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sticky bottom-0 z-30 flex justify-end gap-3 shadow-lg-up">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="outline" onClick={handleSave}>Save as Draft</Button>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]">Save Order</Button>
      </div>

    </div>
  );
}

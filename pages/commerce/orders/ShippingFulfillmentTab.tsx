
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/icons/Icon";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/Select";
import { StatusBadge } from '../../../components/ui/StatusBadge';
import Timeline from '../../../components/ui/Timeline';
import type { ShippingInfo } from '../../../types';

interface ShippingFulfillmentTabProps {
    shippingInfo: ShippingInfo[];
}

const carriers = ["FedEx", "DHL", "UPS", "BlueDart"];

const ShippingFulfillmentTab: React.FC<ShippingFulfillmentTabProps> = ({ shippingInfo }) => {
    const selectedOrder = shippingInfo[2]; // Mock: Select the delivered order for detailed view

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                <Card>
                    <CardHeader><CardTitle>Awaiting Fulfillment</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {shippingInfo.filter(s => s.status === 'Pending' || s.status === 'Packed').map(s => (
                            <div key={s.orderId} className="p-3 border rounded-lg hover:border-green-500 cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-blue-500">{s.orderId}</p>
                                        <p className="text-sm text-gray-500">{s.customerName}</p>
                                    </div>
                                    <StatusBadge status={s.status} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Shipment Details for {selectedOrder.orderId}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Carrier & Label</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Select Carrier</label>
                                    <Select defaultValue={selectedOrder.carrier || undefined}>
                                        <SelectTrigger><SelectValue placeholder="Select a carrier" /></SelectTrigger>
                                        <SelectContent>
                                            {carriers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Tracking Number</label>
                                    <p>{selectedOrder.trackingNumber || 'N/A'}</p>
                                </div>
                                <Button className="w-full">
                                    <Icon name="ticket" className="h-4 w-4 mr-2" />
                                    Generate Shipping Label
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Tracking History</h4>
                            <Timeline items={selectedOrder.history} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ShippingFulfillmentTab;
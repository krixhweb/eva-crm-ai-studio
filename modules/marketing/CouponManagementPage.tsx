
import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge, badgeVariants } from "../../components/ui/Badge";
import { Progress } from "../../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "../../components/ui/Drawer";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Switch } from "../../components/ui/Switch";
import { Icon } from "../../components/shared/Icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/DropdownMenu";
import type { VariantProps } from "class-variance-authority";

const CouponManagementPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [couponType, setCouponType] = useState("percentage");
  const [targetSegment, setTargetSegment] = useState("all");

  const coupons = [
    { code: "SUMMER25", type: "Percentage", value: "25%", usage: 345, limit: 1000, validFrom: "2024-06-01", validUntil: "2024-08-31", status: "active", revenue: 845000, redemptionRate: 34.5 },
    { code: "FREESHIP", type: "Free Shipping", value: "Free", usage: 892, limit: null, validFrom: "2024-01-01", validUntil: "2024-12-31", status: "active", revenue: 1523000, redemptionRate: 89.2 },
    { code: "WELCOME10", type: "Percentage", value: "10%", usage: 1567, limit: null, validFrom: "2024-01-01", validUntil: "2024-12-31", status: "active", revenue: 1289000, redemptionRate: 45.8 },
    { code: "BOGO50", type: "BOGO", value: "50% off 2nd", usage: 234, limit: 500, validFrom: "2024-10-01", validUntil: "2024-10-31", status: "active", revenue: 567000, redemptionRate: 46.8 },
    { code: "FLASH50", type: "Percentage", value: "50%", usage: 150, limit: 150, validFrom: "2024-10-15", validUntil: "2024-10-15", status: "expired", revenue: 345000, redemptionRate: 100 },
    { code: "VIP20", type: "Percentage", value: "20%", usage: 89, limit: 500, validFrom: "2024-01-01", validUntil: "2024-12-31", status: "active", revenue: 423000, redemptionRate: 17.8 },
    { code: "NEWCUST15", type: "Fixed Amount", value: "₹1500", usage: 445, limit: 1000, validFrom: "2024-07-01", validUntil: "2024-12-31", status: "active", revenue: 667500, redemptionRate: 44.5 },
    { code: "LOYAL30", type: "Percentage", value: "30%", usage: 78, limit: 200, validFrom: "2024-09-01", validUntil: "2024-11-30", status: "active", revenue: 789000, redemptionRate: 39.0 },
    { code: "CART50", type: "Fixed Amount", value: "₹5000", usage: 123, limit: 300, validFrom: "2024-08-01", validUntil: "2024-12-31", status: "active", revenue: 987000, redemptionRate: 41.0 },
    { code: "HOLIDAY40", type: "Percentage", value: "40%", usage: 0, limit: 1000, validFrom: "2024-12-01", validUntil: "2024-12-31", status: "scheduled", revenue: 0, redemptionRate: 0 },
  ];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  const stats = [
    { label: "Active Coupons", value: "12", icon: 'tag' as const, color: "text-blue-500" },
    { label: "Total Redemptions", value: "3,978", icon: 'users' as const, color: "text-purple-500" },
    { label: "Revenue Impact", value: formatCurrency(845000), icon: 'dollarSign' as const, color: "text-green-500" },
    { label: "Avg Redemption Rate", value: "38.2%", icon: 'trendingUp' as const, color: "text-yellow-500" }
  ];

  const getStatusBadgeVariant = (status: string): VariantProps<typeof badgeVariants>['variant'] => {
    switch (status) {
      case "active": return "green";
      case "expired": return "gray";
      case "scheduled": return "blue";
      case "paused": return "yellow";
      default: return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Percentage": return <Icon name="percent" className="h-4 w-4" />;
      case "Fixed Amount": return <Icon name="dollarSign" className="h-4 w-4" />;
      default: return <Icon name="tag" className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage discount codes</p>
        </div>
        <Drawer open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DrawerTrigger>
            <Button className="gap-2">
              <Icon name="plus" className="h-4 w-4" />
              Create Coupon
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>Create New Coupon</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input id="code" placeholder="e.g., SUMMER25" className="flex-1" />
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select value={couponType} onValueChange={setCouponType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="freeship">Free Shipping</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Discount Value</Label>
                <Input id="value" type="number" placeholder="e.g., 25" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input id="validFrom" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Total Usage Limit</Label>
                  <Input id="usageLimit" type="number" placeholder="Unlimited if empty" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perCustomer">Limit Per Customer</Label>
                  <Input id="perCustomer" type="number" placeholder="e.g., 1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPurchase">Minimum Purchase Amount</Label>
                <Input id="minPurchase" type="number" placeholder="₹0 if no minimum" />
              </div>

              <div className="space-y-2">
                <Label>Target Segments</Label>
                <Select value={targetSegment} onValueChange={setTargetSegment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers Only</SelectItem>
                    <SelectItem value="champions">Champions</SelectItem>
                    <SelectItem value="loyal">Loyal Customers</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <Label htmlFor="autoRefund">Allow Refund with Coupon</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Refund includes discount amount</p>
                </div>
                <Switch id="autoRefund" />
              </div>
            </div>
            <DrawerFooter className="flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateOpen(false)}>Create Coupon</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
               <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>
                        <Icon name={stat.icon} className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Revenue Impact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.code}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-blue-100/50 dark:bg-blue-900/20 text-blue-600">
                      {getTypeIcon(coupon.type)}
                    </div>
                    <span className="font-mono font-semibold">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{coupon.type}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-blue-600 dark:text-blue-400">{coupon.value}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{coupon.usage}{coupon.limit ? ` / ${coupon.limit}` : ""}</span>
                      <span className="text-gray-500 dark:text-gray-400">{coupon.redemptionRate}%</span>
                    </div>
                    <Progress 
                      value={coupon.limit ? (coupon.usage / coupon.limit) * 100 : coupon.redemptionRate} 
                      className="h-1.5"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(coupon.validFrom).toLocaleDateString()}</div>
                    <div className="text-gray-500 dark:text-gray-400">to {new Date(coupon.validUntil).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(coupon.status)}>
                    {coupon.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600">{formatCurrency(coupon.revenue)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Icon name="moreVertical" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuItem>Export Usage</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 dark:text-red-400">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CouponManagementPage;

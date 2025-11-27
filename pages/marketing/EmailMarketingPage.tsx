import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge, badgeVariants } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Icon } from "../../components/icons/Icon";
import type { VariantProps } from 'class-variance-authority';

const EmailMarketingPage = () => {
  const campaigns = [
    { id: 1, name: "Summer Sale Newsletter", type: "Promotional", status: "Sent", recipients: 2450, sentDate: "2024-01-15", openRate: 24.5, clickRate: 3.2, revenue: 124500 },
    { id: 2, name: "New Product Launch", type: "Newsletter", status: "Sent", recipients: 3200, sentDate: "2024-01-14", openRate: 28.3, clickRate: 4.1, revenue: 234000 },
    { id: 3, name: "Welcome Series - Day 1", type: "Automated", status: "Active", recipients: 1245, sentDate: "Ongoing", openRate: 45.2, clickRate: 8.5, revenue: 89000 },
    { id: 4, name: "Cart Abandonment Reminder", type: "Automated", status: "Active", recipients: 567, sentDate: "Ongoing", openRate: 32.1, clickRate: 12.3, revenue: 456000 },
    { id: 5, name: "Weekly Newsletter #42", type: "Newsletter", status: "Scheduled", recipients: 2890, sentDate: "2024-01-20", openRate: 0, clickRate: 0, revenue: 0 },
    { id: 6, name: "VIP Customer Exclusive", type: "Promotional", status: "Draft", recipients: 450, sentDate: "-", openRate: 0, clickRate: 0, revenue: 0 },
    { id: 7, name: "Product Review Request", type: "Transactional", status: "Sent", recipients: 1890, sentDate: "2024-01-13", openRate: 38.7, clickRate: 15.2, revenue: 0 },
    { id: 8, name: "Holiday Season Special", type: "Promotional", status: "Sent", recipients: 4560, sentDate: "2024-01-10", openRate: 31.2, clickRate: 5.8, revenue: 890000 },
  ];

  const metrics = [
    { label: "Total Campaigns", value: "156", icon: 'mail' as const, color: "text-blue-600" },
    { label: "Active", value: "12", icon: 'trendingUp' as const, color: "text-green-600" },
    { label: "Avg Open Rate", value: "24.5%", icon: 'users' as const, color: "text-purple-600" },
    { label: "Avg CTR", value: "3.2%", icon: 'mousePointer' as const, color: "text-orange-600" },
  ];

  const getStatusBadgeVariant = (status: string): VariantProps<typeof badgeVariants>['variant'] => {
    switch (status) {
      case 'Sent': return 'green';
      case 'Active': return 'blue';
      case 'Scheduled': return 'purple';
      case 'Draft': return 'gray';
      case 'Paused': return 'yellow';
      default: return 'default';
    }
  };

  const getTypeBadgeVariant = (type: string): VariantProps<typeof badgeVariants>['variant'] => {
    switch (type) {
      case 'Newsletter': return 'blue';
      case 'Promotional': return 'green';
      case 'Automated': return 'purple';
      case 'Transactional': return 'yellow';
      default: return 'default';
    }
  };

  const getOpenRateColor = (rate: number) => {
    if (rate > 30) return "text-green-600";
    if (rate > 20) return "text-yellow-600";
    return "text-red-600";
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Email Marketing</h1>
          <p className="text-gray-500 dark:text-gray-400">Create, send, and track email campaigns</p>
        </div>
        <Button className="gap-2">
          <Icon name="plus" className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50`}>
                  <Icon name={metric.icon} className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Impact */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Generated</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(4523000)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
            </div>
            <Icon name="dollarSign" className="h-16 w-16 text-green-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search campaigns..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Types</Button>
              <Button variant="outline">All Status</Button>
              <Button variant="outline">Date Range</Button>
              <Button variant="outline">Sort: Date</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium">Campaign Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Recipients</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Sent Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Open Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">CTR</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <button className="text-blue-500 hover:underline font-medium text-left">
                        {campaign.name}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getTypeBadgeVariant(campaign.type)}>{campaign.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>{campaign.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{campaign.recipients.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{campaign.sentDate}</td>
                    <td className="px-4 py-3">
                      {campaign.openRate > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
                            <div
                              className={`h-2 rounded-full ${getOpenRateColor(campaign.openRate).replace('text', 'bg')}`}
                              style={{ width: `${Math.min(campaign.openRate, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${getOpenRateColor(campaign.openRate)}`}>
                            {campaign.openRate}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {campaign.clickRate > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${Math.min(campaign.clickRate * 10, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{campaign.clickRate}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {campaign.revenue > 0 ? (
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrency(campaign.revenue)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailMarketingPage;
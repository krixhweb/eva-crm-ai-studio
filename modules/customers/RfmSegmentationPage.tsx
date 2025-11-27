
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/shared/Icon';
import { formatCurrency } from '../../lib/utils';
import { rfmSegments } from '../../data/mockData';

const RFMSegmentationPage: React.FC = () => {
  const overviewMetrics: { label: string; value: string; icon: keyof typeof Icon.icons; color: string }[] = [
    { label: "Total Segments", value: "4", icon: 'target', color: "text-green-500" },
    { label: "Customers Segmented", value: "1,238", icon: 'users', color: "text-blue-500" },
    { label: "Highest Value (Champions)", value: formatCurrency(10000000), icon: 'dollarSign', color: "text-green-500" },
    { label: "At Risk Customers", value: "189", icon: 'alertTriangle', color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">RFM Customer Segmentation</h1>
          <p className="text-gray-600 dark:text-gray-400">Segment customers by Recency, Frequency, and Monetary value</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: 2 hours ago</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Configure Rules
          </Button>
          <Button>
            <Icon name="sparkles" className="h-4 w-4 mr-2" />
            Run Segmentation
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50`}>
                  <Icon name={metric.icon} className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rfmSegments.map((segment) => (
          <Card key={segment.name} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${segment.color}`} />
            <CardHeader className={segment.bgColor}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{segment.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{segment.description}</p>
                </div>
                <span className="inline-flex items-center text-lg px-3 py-1 rounded-md bg-gray-200/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 font-medium">
                  {segment.percentage}%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Icon name="users" className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className={`text-xl font-bold ${segment.textColor}`}>
                  {segment.count.toLocaleString()} customers
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 text-center md:text-left">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Spend</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(segment.avgSpend)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Frequency</p>
                  <p className="text-lg font-bold">{segment.avgFrequency} orders</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Purchase</p>
                  <p className="text-lg font-bold">{segment.lastPurchaseAvg} days</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Create Campaign
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Tool */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Compare Segments</Button>
              <Button variant="outline">Configure Scoring Rules</Button>
              <Button variant="outline">Schedule Auto-Run</Button>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-start gap-3">
                <Icon name="sparkles" className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">AI-Powered Insights</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your "At Risk" segment shows high average spend but hasn't purchased in 125 days. 
                    Consider launching a win-back campaign with a 15% discount to re-engage these valuable customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RFMSegmentationPage;

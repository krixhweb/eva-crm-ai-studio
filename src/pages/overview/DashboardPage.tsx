import { Card, CardTitle } from "../../components/ui/Card";
import { Icon } from "../../components/icons/Icon";
import { Button } from "../../components/ui/Button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "../../components/ui/Badge";

// No mock data — placeholder empty arrays for future API calls
const revenueData: any[] = [];
const funnelData: any[] = [];
const topProducts: any[] = [];
const recentOrders: any[] = [];
const lowStockProducts: any[] = [];

// Icon type extracted from Icon.tsx
type IconName = keyof typeof Icon.icons;

// --- STAT CARD ---
const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon,
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: "up" | "down";
  icon: IconName;
}) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

          <p className="text-3xl font-bold">{value}</p>

          <div
            className={`text-sm flex items-center ${
              changeType === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            <Icon
              name="trendingUp"
              className={`w-4 h-4 mr-1 ${
                changeType === "down" ? "rotate-180" : ""
              }`}
            />
            {change}
          </div>
        </div>

        <div className="p-3 bg-green-500 text-white rounded-full">
          <Icon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

// --- STATUS BADGE FOR ORDERS ---
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    Delivered: { variant: "green", icon: "checkCircle" },
    Pending: { variant: "yellow", icon: "alertTriangle" },
    Cancelled: { variant: "red", icon: "close" },
    Processing: { variant: "blue", icon: "activity" },
  }[status] || { variant: "gray", icon: "alertCircle" };

  return (
    <Badge variant={config.variant as any}>
      <span className="flex items-center gap-1">{status}</span>
    </Badge>
  );
};

// --- MAIN DASHBOARD ---
const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Business overview & insights.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value="—"
          change="0%"
          changeType="up"
          icon="dollarSign"
        />
        <StatCard
          title="Orders"
          value="—"
          change="0%"
          changeType="up"
          icon="shoppingCart"
        />
        <StatCard
          title="Customers"
          value="—"
          change="0%"
          changeType="up"
          icon="users"
        />
        <StatCard
          title="Conversion"
          value="—"
          change="0%"
          changeType="down"
          icon="target"
        />
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <CardTitle className="mb-4">Revenue Overview</CardTitle>

        {revenueData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-gray-400">
            No revenue data yet
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Funnel + Top Products + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <Card className="p-6">
          <CardTitle className="mb-4">Sales Funnel</CardTitle>

          {funnelData.length === 0 ? (
            <div className="h-48 text-gray-400 flex items-center justify-center">
              No funnel data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <CardTitle className="mb-4">Top Products</CardTitle>

          {topProducts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No product data yet
            </div>
          ) : (
            topProducts.map((p) => (
              <div key={p.name} className="flex justify-between py-2">
                <span>{p.name}</span>
                <span>{p.sales}</span>
              </div>
            ))
          )}
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <CardTitle className="mb-4">Recent Orders</CardTitle>

          {recentOrders.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No orders yet
            </div>
          ) : (
            recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between py-2">
                <div>
                  <p className="font-bold">{o.id}</p>
                  <p className="text-sm">{o.customer}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Low Stock */}
      <Card className="p-6">
        <CardTitle className="mb-4">Low Stock Alerts</CardTitle>

        {lowStockProducts.length === 0 ? (
          <div className="text-gray-400">No low stock alerts</div>
        ) : (
          lowStockProducts.map((p) => (
            <div key={p.id} className="flex justify-between py-2">
              <span>{p.name}</span>
              <span>{p.stock} left</span>
            </div>
          ))
        )}

        <Button variant="outline" className="w-full mt-4">
          Manage Inventory
        </Button>
      </Card>
    </div>
  );
};

export default DashboardPage;

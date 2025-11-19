// /pages/sales/SalesAnalyticsPage.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Icon } from "../../components/icons/Icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Progress } from "../../components/ui/Progress";
import { Badge } from "../../components/ui/Badge";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "../../lib/utils";
import type {
  SalesActivity,
  TeamMember,
  SalesTask,
  Deal,
} from "../../types";
import {
  mockSalesActivities,
  mockTeamMembers,
  mockSalesTasks,
  // keep mockSalesActivities etc for now — swap with services when ready
} from "../../data/mockdata";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/DropdownMenu";
import { Button } from "../../components/ui/Button";

/* -------------------------------------------------------------------------- */
/* ----------------------------- Small helpers ------------------------------ */
/* -------------------------------------------------------------------------- */

const COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"];

const ChartTooltipBox: React.FC<{ title?: string; content: React.ReactNode }> = ({
  title,
  content,
}) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow border dark:border-gray-700">
    {title && <div className="text-sm font-semibold mb-1">{title}</div>}
    <div className="text-sm">{content}</div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* --------------------------- Performance Tab UI --------------------------- */
/* -------------------------------------------------------------------------- */

const PerformanceTabContent: React.FC = () => {
  // using mock data inside; easy to swap with useService hooks later
  const topPerformers = [
    {
      name: "Sarah Johnson",
      role: "Senior Sales Rep",
      deals: 24,
      revenue: 486000,
      commission: 48600,
      quota: 450000,
      activities: 342,
      winRate: 68,
      avgDeal: 20250,
    },
    {
      name: "Michael Chen",
      role: "Account Executive",
      deals: 19,
      revenue: 412000,
      commission: 41200,
      quota: 400000,
      activities: 298,
      winRate: 62,
      avgDeal: 21684,
    },
    {
      name: "Emily Rodriguez",
      role: "Sales Manager",
      deals: 16,
      revenue: 380000,
      commission: 38000,
      quota: 350000,
      activities: 256,
      winRate: 59,
      avgDeal: 23750,
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Johnson", deals: 24, revenue: 486000, commission: 48600, quotaProgress: 108, activities: 342, winRate: 68, avgDeal: 20250 },
    { rank: 2, name: "Michael Chen", deals: 19, revenue: 412000, commission: 41200, quotaProgress: 103, activities: 298, winRate: 62, avgDeal: 21684 },
    { rank: 3, name: "Emily Rodriguez", deals: 16, revenue: 380000, commission: 38000, quotaProgress: 109, activities: 256, winRate: 59, avgDeal: 23750 },
    { rank: 4, name: "David Park", deals: 15, revenue: 358000, commission: 35800, quotaProgress: 102, activities: 234, winRate: 57, avgDeal: 23867 },
    { rank: 5, name: "Lisa Anderson", deals: 14, revenue: 312000, commission: 31200, quotaProgress: 104, activities: 212, winRate: 54, avgDeal: 22286 },
    { rank: 6, name: "Robert Kim", deals: 13, revenue: 289000, commission: 28900, quotaProgress: 96, activities: 198, winRate: 52, avgDeal: 22231 },
    { rank: 7, name: "Amanda White", deals: 12, revenue: 267000, commission: 26700, quotaProgress: 95, activities: 185, winRate: 48, avgDeal: 22250 },
    { rank: 8, name: "James Taylor", deals: 11, revenue: 245000, commission: 24500, quotaProgress: 98, activities: 176, winRate: 45, avgDeal: 22273 },
    { rank: 9, name: "Maria Garcia", deals: 10, revenue: 218000, commission: 21800, quotaProgress: 95, activities: 162, winRate: 42, avgDeal: 21800 },
    { rank: 10, name: "Kevin Brown", deals: 9, revenue: 192000, commission: 19200, quotaProgress: 96, activities: 148, winRate: 39, avgDeal: 21333 }
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000, quota: 40000 },
    { month: "Feb", revenue: 52000, quota: 45000 },
    { month: "Mar", revenue: 48000, quota: 45000 },
    { month: "Apr", revenue: 61000, quota: 50000 },
    { month: "May", revenue: 55000, quota: 50000 },
    { month: "Jun", revenue: 67000, quota: 55000 },
  ];

  const winRateData = [
    { month: "Jan", rate: 42 },
    { month: "Feb", rate: 48 },
    { month: "Mar", rate: 45 },
    { month: "Apr", rate: 52 },
    { month: "May", rate: 58 },
    { month: "Jun", rate: 62 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPerformers.map((performer, idx) => (
          <Card key={performer.name} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-orange-600'} opacity-10 rounded-bl-full`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {idx === 0 ? <Icon name="trophy" className="h-8 w-8 text-yellow-500" /> :
                   idx === 1 ? <Icon name="trendingUp" className="h-8 w-8 text-gray-500 dark:text-gray-400" /> :
                   <Icon name="target" className="h-8 w-8 text-orange-600" />}
                  <div>
                    <CardTitle className="text-lg">{performer.name}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{performer.role}</p>
                  </div>
                </div>
                <Badge variant={idx === 0 ? "yellow" : idx === 1 ? "gray" : "default"} className={idx === 2 ? "bg-orange-600" : ""}>
                  #{idx + 1}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Deals Closed</p>
                  <p className="text-2xl font-bold">{performer.deals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-green-500">{formatCurrency(performer.revenue)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                  <p className="text-2xl font-bold text-green-500">{performer.winRate}%</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Commission</p>
                  <p className="text-2xl font-bold text-yellow-500">{formatCurrency(performer.commission)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="top" align="right" iconType="circle" height={36} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="quota" name="Quota" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle>Win Rate Trend</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Efficiency of closing deals over time</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Monthly <Icon name="chevronDown" className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
                <DropdownMenuItem>Quarterly</DropdownMenuItem>
                <DropdownMenuItem>Yearly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={winRateData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return <ChartTooltipBox title={String(label)} content={<div className="text-green-600">{`${payload[0].name}: ${payload[0].value}%`}</div>} />;
                    }
                    return null;
                  }}
                  cursor={{ stroke: '#22C55E', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" height={36} wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Win Rate %"
                  stroke="#16A34A"
                  strokeWidth={2}
                  fill="url(#colorWinRate)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Team Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Sales Rep</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Quota Progress</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Avg Deal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leaderboard.map((rep) => (
                <TableRow key={rep.rank}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {rep.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          rep.rank === 1 ? "bg-yellow-500 text-white" : rep.rank === 2 ? "bg-gray-300 text-gray-800" : "bg-orange-600 text-white"
                        }`}>
                          {rep.rank}
                        </div>
                      ) : (
                        <span className="font-medium">{rep.rank}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{rep.name}</div>
                  </TableCell>

                  <TableCell className="font-semibold">{rep.deals}</TableCell>
                  <TableCell className="font-semibold text-green-500">{formatCurrency(rep.revenue)}</TableCell>
                  <TableCell className="font-semibold text-yellow-500">{formatCurrency(rep.commission)}</TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={rep.quotaProgress >= 100 ? "text-green-500 font-medium" : ""}>{rep.quotaProgress}%</span>
                      </div>
                      <Progress value={rep.quotaProgress} className="h-2" />
                    </div>
                  </TableCell>

                  <TableCell>{rep.activities}</TableCell>

                  <TableCell>
                    <Badge variant={rep.winRate >= 60 ? "green" : rep.winRate >= 50 ? "yellow" : "outline"}>
                      {rep.winRate}%
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium">{formatCurrency(rep.avgDeal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ---------------------------- Activity Tab UI ----------------------------- */
/* -------------------------------------------------------------------------- */

const FILTERS = ["All", "Deals", "Meetings", "Calls", "Tasks", "Emails"] as const;
type FilterType = typeof FILTERS[number];
const typeMapping: Record<string, SalesActivity["type"]> = {
  Deals: "DEAL_WON",
  Meetings: "MEETING",
  Calls: "CALL",
  Tasks: "TASK",
  Emails: "EMAIL",
};

const ActivityItem: React.FC<{ activity: SalesActivity }> = ({ activity }) => {
  const itemConfig = (() => {
    switch (activity.type) {
      case "DEAL_WON":
        return { icon: "dollarSign" as const, color: "bg-green-100", iconColor: "text-green-500" };
      case "MEETING":
        return { icon: "calendar" as const, color: "bg-blue-100", iconColor: "text-blue-500" };
      case "CALL":
        return { icon: "phone" as const, color: "bg-purple-100", iconColor: "text-purple-500" };
      case "TASK":
        return { icon: "check" as const, color: "bg-yellow-100", iconColor: "text-yellow-500" };
      case "EMAIL":
        return { icon: "mail" as const, color: "bg-orange-100", iconColor: "text-orange-500" };
      default:
        return { icon: "zap" as const, color: "bg-gray-100", iconColor: "text-gray-500" };
    }
  })();

  return (
    <div className="relative pl-12 pb-8">
      <div className="absolute left-0 top-0">
        <span className={`h-10 w-10 rounded-full flex items-center justify-center ${itemConfig.color}`}>
          <Icon name={itemConfig.icon} className={`w-5 h-5 ${itemConfig.iconColor}`} />
        </span>
      </div>

      <div className="ml-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{activity.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {activity.user.name}
              {activity.relatedCustomer && (
                <> with <Link to={`/customers/${activity.relatedCustomer.id}`} className="text-blue-500 hover:underline">{activity.relatedCustomer.name}</Link></>
              )}
            </p>
            {activity.details && <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">{activity.details}</p>}
          </div>

          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

const ActivityTabContent: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredActivities = useMemo(() => {
    if (activeFilter === "All") return mockSalesActivities;
    return mockSalesActivities.filter((a) => a.type === typeMapping[activeFilter]);
  }, [activeFilter]);

  const activityBreakdownData = useMemo(() => {
    const counts = mockSalesActivities.reduce((acc: Record<string, number>, activity) => {
      const type = activity.type.split("_")[0]; // DEAL_WON -> DEAL
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 border-b dark:border-gray-700 pb-4 mb-4 overflow-x-auto">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${activeFilter === filter ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            {filteredActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Breakdown</h3>

          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={activityBreakdownData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={6}>
                  {activityBreakdownData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value} activities`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {activityBreakdownData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="capitalize">{entry.name.toLowerCase()}</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {[...mockTeamMembers].sort((a, b) => b.revenue - a.revenue).map((member, index) => (
              <div key={member.id} className="flex items-center gap-3">
                <span className="font-bold text-gray-500 w-5">{index + 1}.</span>
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">{member.avatar}</div>
                <div className="flex-grow">
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.dealsClosed} deals closed</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-500">{formatCurrency(member.revenue)}</p>
                  {index === 0 && <Icon name="trophy" className="w-4 h-4 text-yellow-500 inline-block" />}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
          <div className="space-y-2">
            {mockSalesTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <Icon name="checkCircle" className={`w-4 h-4 mt-1 ${task.isOverdue ? "text-red-500" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className={`text-xs ${task.isOverdue ? "text-red-500 font-semibold" : "text-gray-500"}`}>{task.isOverdue ? `Overdue: ${task.dueDate}` : `Due: ${task.dueDate}`}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ----------------------------- KPI component ------------------------------ */
/* -------------------------------------------------------------------------- */

const KPICard: React.FC<{ title: string; value: string; change: string; icon: any; changeIsPositive: boolean; }> = ({ title, value, change, icon, changeIsPositive }) => (
  <Card>
    <CardHeader className="flex items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon name={icon} className="h-4 w-4 text-gray-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${changeIsPositive ? "text-green-500" : "text-red-500"}`}>{change} from last month</p>
    </CardContent>
  </Card>
);

/* -------------------------------------------------------------------------- */
/* --------------------------- Main SalesAnalytics -------------------------- */
/* -------------------------------------------------------------------------- */

const SalesAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance & Activity</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track team performance and view the latest sales activities.</p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icon name="calendar" className="h-4 w-4 mr-2" />
                Last 30 Days
                <Icon name="chevronDown" className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
              <DropdownMenuItem>This Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icon name="users" className="h-4 w-4 mr-2" />
                All Teams
                <Icon name="chevronDown" className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Teams</DropdownMenuItem>
              <DropdownMenuItem>Team Alpha</DropdownMenuItem>
              <DropdownMenuItem>Team Beta</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={formatCurrency(5_403_000)} change="+15.2%" icon="dollarSign" changeIsPositive={true} />
        <KPICard title="Win Rate" value="68%" change="+3.1%" icon="trophy" changeIsPositive={true} />
        <KPICard title="New Deals" value="42" change="-5.4%" icon="plus" changeIsPositive={false} />
        <KPICard title="Activities Logged" value="248" change="+21.3%" icon="activity" changeIsPositive={true} />
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity Stream</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <PerformanceTabContent />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAnalyticsPage;

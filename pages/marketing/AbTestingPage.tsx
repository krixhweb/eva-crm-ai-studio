
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/icons/Icon";
import { Progress } from "../../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";

const AbTestingPage = () => {
    // Mock data for A/B tests
    const tests = [
        { id: 1, name: "Homepage Headline Test", status: "Running", goal: "Conversion Rate", visitors: 12500, variants: ["A", "B"], winner: "B", uplift: 12.5, confidence: 98 },
        { id: 2, name: "Checkout Button Color", status: "Completed", goal: "CTR", visitors: 25000, variants: ["A", "B", "C"], winner: "C", uplift: 8.2, confidence: 99 },
        { id: 3, name: "Product Page Layout", status: "Paused", goal: "Avg. Order Value", visitors: 5600, variants: ["A", "B"], winner: "Inconclusive", uplift: -1.3, confidence: 75 },
        { id: 4, name: "Pricing Page CTA", status: "Draft", goal: "Conversion Rate", visitors: 0, variants: ["A", "B"], winner: "-", uplift: 0, confidence: 0 },
        { id: 5, name: "Mobile Navigation Menu", status: "Running", goal: "CTR", visitors: 8900, variants: ["A", "B"], winner: "A", uplift: 4.1, confidence: 92 },
    ];

    const kpiMetrics = [
        { label: "Active Tests", value: "2", icon: 'beaker' as const, color: "text-blue-500" },
        { label: "Total Visitors", value: "47,000", icon: 'users' as const, color: "text-purple-500" },
        { label: "Avg. Uplift", value: "+6.8%", icon: 'trendingUp' as const, color: "text-green-500" },
        { label: "Completed Tests", value: "18", icon: 'checkCircle' as const, color: "text-gray-500" },
    ];

    const getStatusBadge = (status: string): 'blue' | 'green' | 'yellow' | 'gray' => {
        switch(status) {
            case 'Running': return 'blue';
            case 'Completed': return 'green';
            case 'Paused': return 'yellow';
            case 'Draft': return 'gray';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">A/B Testing</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Optimize your user experience with data-driven experiments.</p>
                </div>
                <Button>
                    <Icon name="plus" className="w-4 h-4 mr-2" />
                    Create New Test
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiMetrics.map(metric => (
                    <Card key={metric.label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700/50 ${metric.color}`}>
                                    <Icon name={metric.icon} className="w-6 h-6" />
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

            <Card>
                <CardHeader>
                    <CardTitle>Experiment Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Test Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Goal Metric</TableHead>
                                <TableHead>Visitors</TableHead>
                                <TableHead>Winner</TableHead>
                                <TableHead>Uplift</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tests.map(test => (
                                <TableRow key={test.id}>
                                    <TableCell className="font-medium">{test.name}</TableCell>
                                    <TableCell><Badge variant={getStatusBadge(test.status)}>{test.status}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Icon name="flag" className="w-4 h-4 text-gray-500" />
                                            {test.goal}
                                        </div>
                                    </TableCell>
                                    <TableCell>{test.visitors.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={test.winner === 'Inconclusive' || test.winner === '-' ? 'outline' : 'default'} className={test.winner !== 'Inconclusive' && test.winner !== '-' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : ''}>{test.winner}</Badge>
                                    </TableCell>
                                    <TableCell className={`font-semibold ${test.uplift > 0 ? 'text-green-500' : test.uplift < 0 ? 'text-red-500' : ''}`}>
                                        {test.uplift !== 0 ? `${test.uplift > 0 ? '+' : ''}${test.uplift}%` : '-'}
                                    </TableCell>
                                    <TableCell>
                                        { test.confidence > 0 ?
                                            <div className="flex items-center gap-2">
                                                <Progress value={test.confidence} className="w-24 h-2" />
                                                <span className="text-xs font-medium">{test.confidence}%</span>
                                            </div>
                                            : <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Results</Button>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
export default AbTestingPage;

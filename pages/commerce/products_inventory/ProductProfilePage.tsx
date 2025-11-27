
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Icon } from "../../../components/icons/Icon";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Textarea } from "../../../components/ui/Textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { Progress } from "../../../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/DropdownMenu";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import { formatCurrency, getStockStatus, calculateMargin, suggestReorderQuantity } from "../../../lib/utils";
import { mockProducts, mockSuppliers } from "../../../data/inventoryMockData";
import type { Product } from "../../../types";
import ReorderModal, { ReplenishmentOrderPayload } from "../../../components/modals/ReorderModal";
import { useToast } from "../../../hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

// --- Extended Types for Local State ---
interface ExtendedProduct extends Product {
  brand: string;
  model: string;
  gtin: string;
  lifecycle: string;
  leadTime: number; // days
  safetyStock: number;
  salesVelocity: number; // units per week
  wholesalePrice: number;
  discountPrice: number;
  damagedStock: number;
  supplierRating: number;
  lastSupplierId: string;
  createdAt: string;
}

// Enhanced Mock History Generator
const generateDetailedHistory = () => [
  { id: 1, type: "Inventory", action: "Stock Replenishment", actor: "System", date: "2 hours ago", details: { before: 14, after: 34, referenceId: "PO-2024-001" } },
  { id: 2, type: "Price", action: "Price Update", actor: "Priya Patel", date: "1 day ago", details: { before: "₹48,000", after: "₹49,999", reason: "Market adjustment" } },
  { id: 3, type: "Transfers", action: "Stock Transfer", actor: "Rohan Kumar", date: "2 days ago", details: { from: "Warehouse A", to: "Storefront", qty: 5 } },
  { id: 4, type: "Sales", action: "Order Placed", actor: "Customer", date: "3 days ago", details: { referenceId: "ORD-1002", qty: 1 } },
  { id: 5, type: "Adjustments", action: "Stock Correction", actor: "Admin", date: "1 week ago", details: { reason: "Damaged goods found", adjustment: -1 } },
  { id: 6, type: "Vendor", action: "Supplier Changed", actor: "System", date: "2 weeks ago", details: { before: "Old Supplier Inc", after: "Furniture Co." } },
  { id: 7, type: "Customer", action: "5-Star Review", actor: "Ananya Singh", date: "3 weeks ago", details: { comment: "Love the quality!" } },
  { id: 8, type: "Inventory", action: "Initial Stock", actor: "System", date: "3 months ago", details: { qty: 50 } },
  { id: 9, type: "Price", action: "Bulk Discount Added", actor: "Priya Patel", date: "3 months ago", details: { value: "15% off for >10 units" } },
  { id: 10, type: "Sales", action: "Order Placed", actor: "Customer", date: "3 months ago", details: { referenceId: "ORD-0998", qty: 2 } },
];

// Mock Sparkline Data
const initialPriceHistory = [
  { date: 'Jan', value: 48000 }, { date: 'Feb', value: 48500 }, { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 49000 }, { date: 'May', value: 49500 }, { date: 'Jun', value: 49999 }
];
const initialCostHistory = [
  { date: 'Jan', value: 27000 }, { date: 'Feb', value: 27500 }, { date: 'Mar', value: 27200 },
  { date: 'Apr', value: 27800 }, { date: 'May', value: 28000 }, { date: 'Jun', value: 28000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProductProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. State Initialization ---
  const baseProduct = mockProducts.find((p) => p.id === id);
  
  // Initialize with extended fields not present in base mock data
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  
  // Stock Rules State
  const [stockRules, setStockRules] = useState({
    outOfStockThreshold: 0,
    criticalThreshold: 5,
    lowStockThreshold: 20
  });

  // Pricing History State
  const [priceHistory, setPriceHistory] = useState(initialPriceHistory);
  const [costHistory, setCostHistory] = useState(initialCostHistory);
  
  // New Data Entry State
  const [newHistoryEntry, setNewHistoryEntry] = useState({ date: '', value: '' });

  // Initialize state only once when baseProduct loads
  useEffect(() => {
    if (baseProduct && !product) {
      setProduct({
        ...baseProduct,
        brand: "LuxeHome",
        model: "CH-2024-X",
        gtin: "1234567890123",
        lifecycle: baseProduct.status,
        leadTime: 14,
        safetyStock: 5,
        salesVelocity: 12, // units/week
        wholesalePrice: Math.round(baseProduct.sellingPrice * 0.85),
        discountPrice: Math.round(baseProduct.sellingPrice * 0.95),
        damagedStock: 1,
        supplierRating: 4.5,
        lastSupplierId: mockSuppliers[0].id,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // 3 months ago
      });
    }
  }, [baseProduct, product]);

  // UI States
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newTag, setNewTag] = useState("");
  const [historyFilter, setHistoryFilter] = useState("All");
  const [historySearch, setHistorySearch] = useState("");
  const [historyPageSize, setHistoryPageSize] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [attachments, setAttachments] = useState<{name: string, size: string, date: string}[]>([
    { name: "Product_Manual_v2.pdf", size: "2.4 MB", date: "2024-01-15" },
    { name: "Warranty_Card.pdf", size: "1.1 MB", date: "2024-01-15" }
  ]);

  // Derived Calculations
  const totalStock = product ? product.stock : 0;
  const inventoryValue = product ? totalStock * product.costPrice : 0;
  const margin = product ? calculateMargin(product.costPrice, product.sellingPrice) : 0;
  const supplierName = product ? mockSuppliers.find(s => s.id === product.lastSupplierId)?.name : "Unknown";

  // --- Stock Status Logic ---
  const stockStatus = useMemo(() => {
    if (!product) return { label: 'Unknown', variant: 'gray', colorClass: 'bg-gray-100 text-gray-800' };
    const { outOfStockThreshold, criticalThreshold, lowStockThreshold } = stockRules;
    const current = product.stock;

    if (current <= outOfStockThreshold) return { label: 'Out of Stock', variant: 'destructive', colorClass: 'bg-red-100 text-red-800 border-red-200' };
    if (current < criticalThreshold) return { label: 'Critical', variant: 'red', colorClass: 'bg-orange-100 text-orange-800 border-orange-200' };
    if (current < lowStockThreshold) return { label: 'Low Stock', variant: 'yellow', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'Healthy', variant: 'green', colorClass: 'bg-green-100 text-green-800 border-green-200' };
  }, [product, stockRules]);

  const rulesError = useMemo(() => {
    const { outOfStockThreshold, criticalThreshold, lowStockThreshold } = stockRules;
    if (outOfStockThreshold >= criticalThreshold) return "Thresholds must be increasing: Out of Stock < Critical.";
    if (criticalThreshold >= lowStockThreshold) return "Thresholds must be increasing: Critical < Low Stock.";
    return null;
  }, [stockRules]);

  // --- 4. Sales & Demand Logic ---
  const demandMetrics = useMemo(() => {
    if (!product) return { forecast30: 0, forecast60: 0, forecast90: 0, risk: 'Low', riskColor: 'text-green-600', riskBg: 'bg-green-100' };
    
    const dailyVelocity = product.salesVelocity / 7;
    const forecast30 = Math.round(dailyVelocity * 30);
    const forecast60 = Math.round(dailyVelocity * 60);
    const forecast90 = Math.round(dailyVelocity * 90);

    // Stockout Risk Calculation based on Forecast
    let risk = 'Low';
    let riskColor = 'text-green-600';
    let riskBg = 'bg-green-50 dark:bg-green-900/20';

    if (forecast30 > totalStock) {
        risk = 'High (Stockout Likely)';
        riskColor = 'text-red-600';
        riskBg = 'bg-red-50 dark:bg-red-900/20';
    } else if (forecast30 > totalStock * 0.8) {
        risk = 'Medium';
        riskColor = 'text-amber-600';
        riskBg = 'bg-amber-50 dark:bg-amber-900/20';
    }

    return { forecast30, forecast60, forecast90, risk, riskColor, riskBg };
  }, [product, totalStock]);

  const projectedRevenue90 = product ? demandMetrics.forecast90 * product.sellingPrice : 0;
  const recommendedReorder = product ? suggestReorderQuantity(product.stock, stockRules.lowStockThreshold) : 0;

  // --- Stock Distribution Data ---
  const stockDistributionData = useMemo(() => {
    if (!product) return [];
    return product.locations.map((loc) => ({
      name: loc.locationName,
      value: loc.stock,
    }));
  }, [product]);

  // --- History Filtering ---
  const filteredHistory = useMemo(() => {
    const allHistory = generateDetailedHistory();
    return allHistory.filter(h => {
      const matchesFilter = historyFilter === 'All' || h.type === historyFilter;
      const matchesSearch = historySearch === '' || 
        h.action.toLowerCase().includes(historySearch.toLowerCase()) || 
        h.actor.toLowerCase().includes(historySearch.toLowerCase()) ||
        JSON.stringify(h.details).toLowerCase().includes(historySearch.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [historyFilter, historySearch]);

  const paginatedHistory = filteredHistory.slice(0, historyPageSize);

  // Handlers
  const handleUpdateField = (field: keyof ExtendedProduct, value: any) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && product) {
      if (!product.tags.includes(newTag.trim())) {
        handleUpdateField('tags', [...product.tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!product) return;
    handleUpdateField('tags', product.tags.filter(t => t !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachments([...attachments, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0]
      }]);
      toast({ title: "File Uploaded", description: `${file.name} attached successfully.` });
    }
  };

  const handleReorderSubmit = (orderData: ReplenishmentOrderPayload) => {
    toast({ title: "Order Created", description: `PO ${orderData.orderId} submitted.` });
    setIsReorderOpen(false);
  };

  const resetStockRules = () => {
    setStockRules({
      outOfStockThreshold: 0,
      criticalThreshold: 5,
      lowStockThreshold: 20
    });
  };

  const handleSaveProduct = () => {
    setIsEditing(false);
    toast({ title: "Changes Saved", description: `${product?.name} has been updated.` });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast({ title: "Changes Discarded", description: "Edit mode cancelled." });
  };

  const handleDeleteProduct = () => {
    setIsDeleteOpen(false);
    navigate("/commerce/products");
    toast({ title: "Product Deleted", description: "The product has been permanently removed.", variant: "destructive" });
  };

  const handleStockAction = (action: string, location: string) => {
    toast({ title: action, description: `Action initiated for ${location}.` });
  };

  const handleAddHistory = (type: 'price' | 'cost') => {
    if (!newHistoryEntry.date || !newHistoryEntry.value) {
      toast({ title: "Validation Error", description: "Please select a date and enter a value.", variant: "destructive" });
      return;
    }
    
    const newValue = Number(newHistoryEntry.value);
    const newEntry = { date: newHistoryEntry.date, value: newValue };

    if (type === 'price') {
        setPriceHistory(prev => [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        // Optionally update current selling price if it's a new date
        handleUpdateField('sellingPrice', newValue);
        toast({ title: "Price Updated", description: "Selling price history updated." });
    } else {
        setCostHistory(prev => [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        handleUpdateField('costPrice', newValue);
        toast({ title: "Cost Updated", description: "Cost price history updated." });
    }
    setNewHistoryEntry({ date: '', value: '' });
  };

  // Helper for History Icons
  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'Inventory': return { icon: 'package', color: 'bg-blue-100 text-blue-600' };
      case 'Price': return { icon: 'dollarSign', color: 'bg-green-100 text-green-600' };
      case 'Vendor': return { icon: 'users', color: 'bg-purple-100 text-purple-600' };
      case 'Sales': return { icon: 'shoppingCart', color: 'bg-orange-100 text-orange-600' };
      case 'Customer': return { icon: 'star', color: 'bg-yellow-100 text-yellow-600' };
      case 'Adjustments': return { icon: 'edit2', color: 'bg-red-100 text-red-600' };
      case 'Transfers': return { icon: 'refreshCw', color: 'bg-teal-100 text-teal-600' };
      default: return { icon: 'activity', color: 'bg-gray-100 text-gray-600' };
    }
  };

  if (!product) return <div className="p-8 text-center">Loading Product...</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* --- Top Navigation & Actions --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/commerce/products", { state: { defaultTab: 'catalog' } })} className="gap-2 pl-0 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 w-fit">
          <Icon name="arrowLeft" className="h-4 w-4" /> Back to Catalog
        </Button>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              <Button onClick={handleSaveProduct} className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-zinc-800">
                  <Icon name="moreVertical" className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Icon name="edit" className="h-4 w-4 mr-2" /> Edit Product
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Export Started", description: "Downloading CSV..." })}>
                  <Icon name="download" className="h-4 w-4 mr-2" /> Export Product Data
                </DropdownMenuItem>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
                  <Icon name="close" className="h-4 w-4 mr-2" /> Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* --- 1. Product Header (Redesigned Card) --- */}
      <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-zinc-900">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 1. Left: Product Image */}
            <div className="w-48 h-48 flex-shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border dark:border-zinc-700 shadow-sm group relative">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Icon name="image" className="h-12 w-12 opacity-50" />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
                  <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Change Image</span>
                </div>
              )}
            </div>

            {/* 2. Center: Content */}
            <div className="flex-1 w-full space-y-6">
              {/* Top Row: Badges & Date */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 text-xs font-medium uppercase tracking-wider border-gray-300 dark:border-gray-600">
                    {product.category}
                  </Badge>
                  <Badge className={product.lifecycle === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                    {product.lifecycle}
                  </Badge>
                </div>
                
                {/* Created At Highlight */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                  <Icon name="calendar" className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                    Created: {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                {isEditing ? (
                  <Input 
                    className="text-3xl font-bold h-auto py-2 px-3 -ml-3 border-dashed focus:border-solid" 
                    value={product.name} 
                    onChange={(e) => handleUpdateField('name', e.target.value)} 
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {product.name}
                  </h1>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-gray-100 dark:border-zinc-800">
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide mb-1">SKU</p>
                  {isEditing ? (
                    <Input className="h-8 text-sm" value={product.sku} onChange={(e) => handleUpdateField('sku', e.target.value)} />
                  ) : (
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">{product.sku}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide mb-1">Brand</p>
                  {isEditing ? (
                    <Input className="h-8 text-sm" value={product.brand} onChange={(e) => handleUpdateField('brand', e.target.value)} />
                  ) : (
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-200">{product.brand}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide mb-1">Model No</p>
                  {isEditing ? (
                    <Input className="h-8 text-sm" value={product.model} onChange={(e) => handleUpdateField('model', e.target.value)} />
                  ) : (
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-200">{product.model}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide mb-1">GTIN</p>
                  {isEditing ? (
                    <Input className="h-8 text-sm font-mono" value={product.gtin} onChange={(e) => handleUpdateField('gtin', e.target.value)} />
                  ) : (
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">{product.gtin}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1.5 pl-2 pr-1 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      {tag}
                      {isEditing && (
                        <button onClick={() => handleRemoveTag(tag)} className="p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500">
                          <Icon name="close" className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="relative group">
                     <div className="flex items-center">
                        <Input 
                          placeholder="+ Tag" 
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          onKeyDown={handleAddTag}
                          className="h-7 w-20 text-xs px-2 bg-transparent border-dashed border-gray-300 hover:border-gray-400 focus:w-32 transition-all"
                        />
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- 8. Main Tabs Layout --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start border-b dark:border-gray-700 rounded-none h-auto p-0 bg-transparent overflow-x-auto">
          {['Overview', 'Stock & Warehouses', 'Pricing', 'Sales & Demand', 'History', 'Files'].map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab.toLowerCase().split(' ')[0]} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:text-green-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ================= TAB: OVERVIEW ================= */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                  <Textarea 
                    disabled={!isEditing}
                    value={product.description} 
                    onChange={(e) => handleUpdateField('description', e.target.value)}
                    className={`min-h-[150px] border-none resize-none focus-visible:ring-0 p-0 -ml-1 ${!isEditing ? 'bg-transparent' : ''}`}
                  />
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-gray-500 uppercase">Total Stock</p>
                    <p className={`text-2xl font-bold mt-1 ${totalStock === 0 ? 'text-red-500' : ''}`}>{totalStock}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-gray-500 uppercase">Inventory Value</p>
                    <p className="text-2xl font-bold mt-1 text-blue-600">{formatCurrency(inventoryValue)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-gray-500 uppercase">Profit Margin</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">{margin}%</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side: Status */}
            <div className="space-y-6">
              <Card className={`${demandMetrics.riskBg} border-none`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="alertTriangle" className={`w-5 h-5 ${demandMetrics.riskColor}`} />
                    <h3 className={`font-semibold ${demandMetrics.riskColor}`}>Stockout Risk: {demandMetrics.risk}</h3>
                  </div>
                  <p className="text-sm opacity-80 mb-4">
                    Current stock ({totalStock}) vs 30-day forecast ({demandMetrics.forecast30}). Lead time is {product.leadTime} days.
                  </p>
                  <Button size="sm" className="w-full bg-white text-black hover:bg-gray-100 border border-gray-200 shadow-sm" onClick={() => setActiveTab('sales')}>
                    View Forecast
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Lifecycle Status</CardTitle></CardHeader>
                <CardContent>
                  <Select disabled={!isEditing} value={product.lifecycle} onValueChange={(v) => handleUpdateField('lifecycle', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-2">
                    Controls visibility in sales channels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB: STOCK & WAREHOUSES ================= */}
        <TabsContent value="stock" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Multi-Location Inventory</CardTitle>
                    <Badge variant="outline">Total: {totalStock}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border dark:border-zinc-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                          <TableHead>Location Name</TableHead>
                          <TableHead className="text-right">Available</TableHead>
                          <TableHead className="text-right">Committed</TableHead>
                          <TableHead className="text-right">Incoming</TableHead>
                          <TableHead className="text-right">Transfer</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.locations.map((loc, idx) => {
                          const status = getStockStatus(loc.stock, product.safetyStock);
                          // Mock additional data per location for visualization
                          const committed = Math.floor(loc.stock * 0.2);
                          const incoming = Math.floor(Math.random() * 10);
                          const transfer = Math.floor(Math.random() * 5);

                          return (
                            <TableRow key={loc.locationId}>
                              <TableCell>
                                <div className="font-medium">{loc.locationName}</div>
                                <div className="text-[10px] text-gray-500">{loc.locationId}</div>
                              </TableCell>
                              <TableCell className="text-right font-bold">{loc.stock}</TableCell>
                              <TableCell className="text-right text-gray-600 dark:text-gray-400">{committed}</TableCell>
                              <TableCell className="text-right text-gray-600 dark:text-gray-400">{incoming > 0 ? `+${incoming}` : '-'}</TableCell>
                              <TableCell className="text-right text-gray-600 dark:text-gray-400">{transfer > 0 ? `↔ ${transfer}` : '-'}</TableCell>
                              <TableCell className="text-center"><Badge variant={status.variant as any}>{status.text}</Badge></TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Icon name="moreVertical" className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleStockAction('Transfer Stock', loc.locationName)}>Transfer Stock</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStockAction('Adjust Stock', loc.locationName)}>Adjust Stock</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStockAction('View History', loc.locationName)}>View History</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 2. Stock Distribution & Rules */}
            <div className="space-y-6">
              
              {/* Stock Distribution Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Stock Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stockDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stockDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 space-y-1">
                    {stockDistributionData.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-gray-600 dark:text-gray-400">{entry.name}</span>
                        </div>
                        <span className="font-medium">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stock Rules Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Stock Rules</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs text-gray-500"
                      onClick={resetStockRules}
                      disabled={!isEditing}
                    >
                      Reset Defaults
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Result Display */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg flex justify-between items-center border border-gray-100 dark:border-zinc-800">
                    <span className="text-sm font-medium">Current Stock: <strong>{totalStock}</strong></span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Result:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stockStatus.colorClass}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Rule Inputs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Out of Stock when stock ≤</Label>
                      <Input 
                        type="number" 
                        disabled={!isEditing}
                        className="w-20 h-8 text-right" 
                        value={stockRules.outOfStockThreshold} 
                        onChange={(e) => setStockRules({...stockRules, outOfStockThreshold: Number(e.target.value)})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Critical when stock &lt;</Label>
                      <Input 
                        type="number" 
                        disabled={!isEditing}
                        className="w-20 h-8 text-right" 
                        value={stockRules.criticalThreshold} 
                        onChange={(e) => setStockRules({...stockRules, criticalThreshold: Number(e.target.value)})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Low Stock when stock &lt;</Label>
                      <Input 
                        type="number" 
                        disabled={!isEditing}
                        className="w-20 h-8 text-right" 
                        value={stockRules.lowStockThreshold} 
                        onChange={(e) => setStockRules({...stockRules, lowStockThreshold: Number(e.target.value)})} 
                      />
                    </div>
                  </div>

                  {/* Validation Error */}
                  {rulesError && (
                    <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                      {rulesError}
                    </p>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </TabsContent>

        {/* ================= TAB: PRICING ================= */}
        <TabsContent value="pricing" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Charts & Strategy */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. History Charts with Data Entry Tabs */}
              <Card>
                <Tabs defaultValue="selling">
                  <CardHeader className="pb-0 border-b dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">Price History</CardTitle>
                    </div>
                    <TabsList className="w-fit h-9 p-0 bg-transparent">
                        <TabsTrigger value="selling" className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-4 bg-transparent shadow-none border-transparent">Selling Price</TabsTrigger>
                        <TabsTrigger value="cost" className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none px-4 bg-transparent shadow-none border-transparent">Cost Price</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <TabsContent value="selling" className="mt-0 space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Current Selling Price</p>
                                <span className="text-2xl font-bold text-green-600">{formatCurrency(product.sellingPrice)}</span>
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="space-y-1">
                                    <Label className="text-xs">Date</Label>
                                    <Input type="date" className="h-8 w-32" value={newHistoryEntry.date} onChange={e => setNewHistoryEntry({...newHistoryEntry, date: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">New Price</Label>
                                    <Input type="number" placeholder="0.00" className="h-8 w-24" value={newHistoryEntry.value} onChange={e => setNewHistoryEntry({...newHistoryEntry, value: e.target.value})} />
                                </div>
                                <Button size="sm" className="h-8" onClick={() => handleAddHistory('price')}>Add</Button>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                        formatter={(value: number) => [formatCurrency(value), 'Price']}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="cost" className="mt-0 space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Current Cost Price</p>
                                <span className="text-2xl font-bold text-red-600">{formatCurrency(product.costPrice)}</span>
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="space-y-1">
                                    <Label className="text-xs">Date</Label>
                                    <Input type="date" className="h-8 w-32" value={newHistoryEntry.date} onChange={e => setNewHistoryEntry({...newHistoryEntry, date: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">New Cost</Label>
                                    <Input type="number" placeholder="0.00" className="h-8 w-24" value={newHistoryEntry.value} onChange={e => setNewHistoryEntry({...newHistoryEntry, value: e.target.value})} />
                                </div>
                                <Button size="sm" className="h-8" onClick={() => handleAddHistory('cost')}>Add</Button>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={costHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                        formatter={(value: number) => [formatCurrency(value), 'Cost']}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>

              {/* 2. Pricing Strategy & Tiers */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Pricing Strategy</CardTitle>
                      <CardDescription>Manage price points across different sales channels.</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                        <Icon name="edit2" className="w-3.5 h-3.5 mr-2" /> Update Prices
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {/* Retail */}
                    <div className="grid grid-cols-3 gap-4 items-center pb-4 border-b border-dashed dark:border-zinc-800">
                      <div className="col-span-1">
                        <Label className="text-base font-semibold">Retail (MRP)</Label>
                        <p className="text-xs text-gray-500">Standard price for end consumers.</p>
                      </div>
                      <div className="col-span-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <Input 
                          disabled={!isEditing} 
                          className="pl-8 font-bold text-lg h-11" 
                          type="number" 
                          value={product.sellingPrice} 
                          onChange={(e) => handleUpdateField('sellingPrice', Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    {/* Wholesale */}
                    <div className="grid grid-cols-3 gap-4 items-center pb-4 border-b border-dashed dark:border-zinc-800">
                      <div className="col-span-1">
                        <Label className="font-medium">Wholesale / B2B</Label>
                        <p className="text-xs text-gray-500">Bulk purchase price point.</p>
                      </div>
                      <div className="col-span-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <Input 
                          disabled={!isEditing} 
                          className="pl-8" 
                          type="number" 
                          value={product.wholesalePrice} 
                          onChange={(e) => handleUpdateField('wholesalePrice', Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    {/* Discount */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="col-span-1">
                        <Label className="font-medium text-orange-600">Discount / Offer</Label>
                        <p className="text-xs text-gray-500">Promotional pricing.</p>
                      </div>
                      <div className="col-span-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <Input 
                          disabled={!isEditing} 
                          className="pl-8 border-orange-200 focus-visible:ring-orange-500" 
                          type="number" 
                          value={product.discountPrice} 
                          onChange={(e) => handleUpdateField('discountPrice', Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Recommendations & Analysis */}
            <div className="space-y-6">
              
              {/* Profitability Analysis */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Projected Profit Margins</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">Retail Margin</span>
                      <span className="text-sm font-bold text-green-600">{calculateMargin(product.costPrice, product.sellingPrice)}%</span>
                    </div>
                    <Progress value={calculateMargin(product.costPrice, product.sellingPrice)} className="h-2 bg-green-100" />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">Target: 45%</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">Wholesale Margin</span>
                      <span className="text-sm font-bold text-blue-600">{calculateMargin(product.costPrice, product.wholesalePrice)}%</span>
                    </div>
                    <Progress value={calculateMargin(product.costPrice, product.wholesalePrice)} className="h-2 bg-blue-100" />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">Target: 30%</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </TabsContent>

        {/* ================= TAB: SALES & DEMAND ================= */}
        <TabsContent value="sales" className="space-y-6 mt-6">
          
          {/* 1. Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                  <Icon name="activity" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Sales Velocity</p>
                  <p className="text-lg font-bold">{product.salesVelocity} <span className="text-xs font-normal text-gray-400">units/week</span></p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                  <Icon name="dollarSign" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Proj. Revenue (90d)</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(projectedRevenue90)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${demandMetrics.riskBg}`}>
                  <Icon name="alertTriangle" className={`w-5 h-5 ${demandMetrics.riskColor}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Stockout Probability</p>
                  <p className={`text-lg font-bold ${demandMetrics.riskColor}`}>{demandMetrics.risk}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600">
                  <Icon name="trophy" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Bestseller Rank</p>
                  <p className="text-lg font-bold">#4 <span className="text-xs font-normal text-gray-400">in {product.category}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2. Main Charts Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Forecast Chart */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Demand Forecast</CardTitle>
                    <Badge variant="outline">Next 90 Days</Badge>
                  </div>
                  <CardDescription>Projected sales based on current velocity and seasonal trends.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { day: 'Today', demand: 0 },
                        { day: '15 Days', demand: Math.round(demandMetrics.forecast30 / 2) },
                        { day: '30 Days', demand: demandMetrics.forecast30 },
                        { day: '45 Days', demand: Math.round(demandMetrics.forecast60 * 0.75) },
                        { day: '60 Days', demand: demandMetrics.forecast60 },
                        { day: '75 Days', demand: Math.round(demandMetrics.forecast90 * 0.83) },
                        { day: '90 Days', demand: demandMetrics.forecast90 },
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                          itemStyle={{ color: '#8B5CF6', fontWeight: 600 }}
                        />
                        <Area type="monotone" dataKey="demand" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Comparing {product.name} against category average and top performers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'This Product', value: product.salesVelocity, fill: '#3B82F6' },
                        { name: 'Category Avg', value: Math.round(product.salesVelocity * 0.8), fill: '#9CA3AF' },
                        { name: 'Top Performer', value: Math.round(product.salesVelocity * 1.5), fill: '#10B981' },
                      ]} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={30}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} width={100} axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#6B7280', fontSize: 12 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3. Right Column: Actionable Intelligence */}
            <div className="space-y-6">
              {/* Inventory Optimization Card */}
              <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Icon name="package" className="w-4 h-4 text-blue-500" />
                    Inventory Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-dashed dark:border-zinc-800">
                    <span className="text-xs text-gray-500">Rec. Reorder Qty</span>
                    <span className="text-sm font-bold">{recommendedReorder} units</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-dashed dark:border-zinc-800">
                    <span className="text-xs text-gray-500">Avg Restock Freq</span>
                    <span className="text-sm font-bold">24 days</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9" onClick={() => setIsReorderOpen(true)}>
                    Create Purchase Order
                  </Button>
                </CardContent>
              </Card>

              {/* Pricing Insight Card */}
              <Card className="border-l-4 border-l-amber-500 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Icon name="trendingUp" className="w-4 h-4 text-amber-500" />
                    Pricing Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    <strong>Opportunity:</strong> Increasing price by 2% could improve margin by 0.8% without significant impact on sales velocity.
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-500">Suggested Price</span>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(Math.round(product.sellingPrice * 1.02))}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => setActiveTab('pricing')}>
                    Review Pricing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB: HISTORY ================= */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Audit Log & History</CardTitle>
                  <CardDescription>Track all changes, movements, and activities related to this product.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Export Started", description: "History export is being generated." })}>
                  <Icon name="download" className="h-4 w-4 mr-2" />
                  Export History
                </Button>
              </div>
              
              <div className="flex flex-col gap-4 mt-4">
                {/* Search */}
                <div className="relative">
                  <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search history events..." 
                    className="pl-10"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Inventory', 'Price', 'Vendor', 'Sales', 'Customer', 'Adjustments', 'Transfers'].map(f => (
                    <Button 
                      key={f} 
                      variant={historyFilter === f ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setHistoryFilter(f)}
                      className={`h-7 text-xs rounded-full ${historyFilter === f ? '' : 'bg-transparent border-dashed'}`}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 border-l border-gray-200 dark:border-gray-800 space-y-8 mt-2">
                {paginatedHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm italic">No history events found matching your filters.</div>
                ) : (
                  paginatedHistory.map((item) => {
                    const iconData = getHistoryIcon(item.type);
                    return (
                      <div key={item.id} className="relative">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm ${iconData.color}`}>
                          <Icon name={iconData.icon as any} className="w-4 h-4" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              by <span className="font-medium text-gray-700 dark:text-gray-300">{item.actor}</span>
                            </p>
                            
                            {/* Details Section */}
                            {item.details && (
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded border border-gray-100 dark:border-zinc-800">
                                {Object.entries(item.details).map(([key, val]) => (
                                  <div key={key} className="flex gap-2">
                                    <span className="capitalize font-medium text-gray-500">{key}:</span>
                                    <span>{val}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {filteredHistory.length > historyPageSize && (
                <div className="mt-8 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setHistoryPageSize(prev => prev + 5)}>
                    Load More Activity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= TAB: FILES ================= */}
        <TabsContent value="files" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documents & Files</CardTitle>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="arrowUp" className="w-4 h-4 mr-2" /> Upload File
                </Button>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload}
                />
              </div>
            </CardHeader>
            <CardContent>
              {attachments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  <Icon name="fileText" className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No files attached yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-black rounded border dark:border-zinc-700">
                          <Icon name="fileText" className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} • Uploaded {file.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Icon name="download" className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Icon name="close" className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Modals */}
      {isReorderOpen && product && (
        <ReorderModal 
          isOpen={isReorderOpen} 
          onClose={() => setIsReorderOpen(false)} 
          onSubmit={handleReorderSubmit}
          product={product} 
        />
      )}

      {isDeleteOpen && (
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteProduct}
          title="Delete Product"
          description={`Are you sure you want to delete ${product.name}? This action cannot be undone and will remove all inventory history.`}
        />
      )}
    </div>
  );
};

export default ProductProfilePage;

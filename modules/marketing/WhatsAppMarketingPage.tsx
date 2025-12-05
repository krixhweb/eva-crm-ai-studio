
import React, { useState, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../components/ui/Dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Icon } from '../../components/shared/Icon';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import { cn } from '../../lib/utils';

// --- Types ---
interface Campaign {
  id: string;
  name: string;
  status: 'Sent' | 'Scheduled' | 'Draft' | 'Failed';
  sent: number;
  delivered: number;
  read: number;
  clicks: number;
  createdAt: string;
}

interface Template {
  id: string;
  name: string;
  language: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  category: string;
  body: string;
  variables: string[];
}

interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
}

interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  time: string;
  unread: boolean;
}

// --- Mock Data ---
const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'cmp_1', name: 'Summer Sale Blast', status: 'Sent', sent: 1250, delivered: 1240, read: 980, clicks: 150, createdAt: '2024-06-15' },
  { id: 'cmp_2', name: 'Cart Recovery #42', status: 'Sent', sent: 50, delivered: 48, read: 35, clicks: 12, createdAt: '2024-06-18' },
  { id: 'cmp_3', name: 'Product Launch - Alpha', status: 'Scheduled', sent: 0, delivered: 0, read: 0, clicks: 0, createdAt: '2024-06-20' },
];

const MOCK_TEMPLATES: Template[] = [
  { id: 'tpl_1', name: 'welcome_message', language: 'en_US', status: 'Approved', category: 'Marketing', body: 'Hello {{1}}, welcome to Eva Store! Use code {{2}} for 10% off.', variables: ['1', '2'] },
  { id: 'tpl_2', name: 'order_update', language: 'en_US', status: 'Approved', category: 'Utility', body: 'Hi {{1}}, your order #{{2}} has been shipped.', variables: ['1', '2'] },
  { id: 'tpl_3', name: 'abandoned_cart', language: 'en_US', status: 'Approved', category: 'Marketing', body: 'Did you forget something? Complete your purchase now: {{1}}', variables: ['1'] },
  { id: 'tpl_4', name: 'seasonal_promo', language: 'es_ES', status: 'Pending', category: 'Marketing', body: 'Hola {{1}}, check out our summer collection!', variables: ['1'] },
];

const MOCK_SEGMENTS: Segment[] = [
  { id: 'seg_1', name: 'All Customers', count: 12450, description: 'Entire customer base' },
  { id: 'seg_2', name: 'VIP Members', count: 450, description: 'Spent > $500 last month' },
  { id: 'seg_3', name: 'Cart Abandoners', count: 125, description: 'Added to cart in last 24h' },
  { id: 'seg_4', name: 'New Signups', count: 890, description: 'Joined in last 30 days' },
];

const MOCK_INBOX: Message[] = [
  { id: 'msg_1', name: 'Alice Johnson', phone: '+1 555-0101', message: 'Is the sale still active?', time: '10:30 AM', unread: true },
  { id: 'msg_2', name: 'Bob Smith', phone: '+1 555-0102', message: 'Thanks for the update!', time: 'Yesterday', unread: false },
  { id: 'msg_3', name: 'Charlie Davis', phone: '+1 555-0103', message: 'I need help with my order #1234', time: 'Yesterday', unread: true },
  { id: 'msg_4', name: 'Dana Lee', phone: '+1 555-0104', message: 'Stop', time: '2 days ago', unread: false },
  { id: 'msg_5', name: 'Evan Wright', phone: '+1 555-0105', message: 'Can I change my shipping address?', time: '2 days ago', unread: false },
];

const WhatsAppMarketingPage = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Campaign Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // --- Handlers ---

  const handleOpenCreate = (preSelectedTemplateId?: string, preSelectedSegmentId?: string) => {
    setSelectedTemplateId(preSelectedTemplateId || '');
    setSelectedSegmentId(preSelectedSegmentId || '');
    setNewCampaignName('');
    setVariableValues({});
    setIsCreateOpen(true);
  };

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: `cmp_${Date.now()}`,
      name: newCampaignName || 'Untitled Campaign',
      status: 'Scheduled',
      sent: 0,
      delivered: 0,
      read: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns([newCampaign, ...campaigns]);
    setIsCreateOpen(false);
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [campaigns, searchTerm]);

  const selectedTemplate = MOCK_TEMPLATES.find(t => t.id === selectedTemplateId);

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
            <Icon name="messageCircle" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Marketing</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage broadcasts, templates, and conversations.</p>
          </div>
        </div>
        <Button 
            onClick={() => handleOpenCreate()} 
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
        >
            <Icon name="plus" className="w-4 h-4 mr-2" /> Create Campaign
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto bg-gray-100 dark:bg-zinc-800 p-1 border dark:border-zinc-700">
          <TabsTrigger value="campaigns" className="flex-1 md:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Campaigns</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 md:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Templates</TabsTrigger>
          <TabsTrigger value="segments" className="flex-1 md:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Segments</TabsTrigger>
          <TabsTrigger value="inbox" className="flex-1 md:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Inbox</TabsTrigger>
        </TabsList>

        {/* 1. CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
             <div className="relative flex-1">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Search campaigns..." 
                    className="pl-9 h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button variant="outline" className="h-10">
                 <Icon name="list" className="w-4 h-4 mr-2" /> Filter
             </Button>
          </div>

          <Card>
             <div className="rounded-md border dark:border-zinc-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-zinc-800/50">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Sent</TableHead>
                            <TableHead className="text-right">Delivered</TableHead>
                            <TableHead className="text-right">Read</TableHead>
                            <TableHead className="text-right">Clicks</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCampaigns.map((campaign) => (
                            <TableRow key={campaign.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                    {campaign.name}
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        variant={campaign.status === 'Sent' ? 'green' : campaign.status === 'Scheduled' ? 'blue' : 'gray'}
                                        className="bg-opacity-15 border-0"
                                    >
                                        {campaign.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-gray-500">{campaign.delivered.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-semibold text-blue-600">{campaign.read.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-gray-500 text-xs">{campaign.createdAt}</TableCell>
                            </TableRow>
                        ))}
                        {filteredCampaigns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                    No campaigns found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
             </div>
          </Card>
        </TabsContent>

        {/* 2. TEMPLATES TAB */}
        <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_TEMPLATES.map((tpl) => (
                    <Card key={tpl.id} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100 truncate pr-2" title={tpl.name}>
                                    {tpl.name}
                                </CardTitle>
                                <Badge variant={tpl.status === 'Approved' ? 'green' : tpl.status === 'Rejected' ? 'red' : 'yellow'}>
                                    {tpl.status}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <span className="uppercase bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{tpl.language}</span>
                                <span>•</span>
                                <span>{tpl.category}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900 text-sm text-gray-700 dark:text-gray-300 italic relative">
                                <Icon name="messageCircle" className="w-4 h-4 absolute top-3 right-3 text-green-300 opacity-50" />
                                "{tpl.body}"
                            </div>
                            <div className="mt-auto pt-2">
                                <Button 
                                    variant="outline" 
                                    className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-900/20"
                                    onClick={() => {
                                        handleOpenCreate(tpl.id);
                                        setActiveTab('campaigns');
                                    }}
                                >
                                    Use Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {/* New Template Placeholder */}
                <button className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-green-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all min-h-[250px]">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Icon name="plus" className="w-6 h-6" />
                    </div>
                    <span className="font-medium">New Template</span>
                </button>
            </div>
        </TabsContent>

        {/* 3. SEGMENTS TAB */}
        <TabsContent value="segments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_SEGMENTS.map((seg) => (
                    <Card key={seg.id} className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                <Icon name="users" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">{seg.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{seg.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{seg.count.toLocaleString()}</div>
                            <div className="text-xs text-gray-400 uppercase mb-2">Contacts</div>
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                    handleOpenCreate(undefined, seg.id);
                                    setActiveTab('campaigns');
                                }}
                            >
                                Select
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </TabsContent>

        {/* 4. INBOX TAB */}
        <TabsContent value="inbox" className="h-[600px] flex gap-6">
            <Card className="w-full md:w-1/3 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
                    <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Recent Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {MOCK_INBOX.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={cn(
                                "p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors relative",
                                msg.unread ? "bg-green-50/50 dark:bg-green-900/10" : ""
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={cn("text-sm font-bold", msg.unread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300")}>{msg.name}</h4>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{msg.phone}</p>
                            <p className={cn("text-sm line-clamp-2", msg.unread ? "text-gray-800 dark:text-gray-200 font-medium" : "text-gray-500")}>
                                {msg.message}
                            </p>
                            {msg.unread && (
                                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-900" />
                            )}
                        </div>
                    ))}
                </div>
            </Card>
            
            <Card className="hidden md:flex flex-1 flex-col h-full bg-gray-50/50 dark:bg-zinc-900/50 border-dashed items-center justify-center text-center p-8">
                 <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
                     <Icon name="messageSquare" className="w-8 h-8" />
                 </div>
                 <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Select a conversation</h3>
                 <p className="text-sm text-gray-500 max-w-xs">Choose a message from the left to view the full conversation history and reply.</p>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create WhatsApp Campaign</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input 
                    placeholder="e.g. Diwali Offer 2024" 
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Select Audience</Label>
                    <Select value={selectedSegmentId} onValueChange={setSelectedSegmentId}>
                        <SelectTrigger><SelectValue placeholder="Choose Segment" /></SelectTrigger>
                        <SelectContent>
                            {MOCK_SEGMENTS.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.count})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Select Template</Label>
                    <Select value={selectedTemplateId} onValueChange={(v) => { setSelectedTemplateId(v); setVariableValues({}); }}>
                        <SelectTrigger><SelectValue placeholder="Choose Template" /></SelectTrigger>
                        <SelectContent>
                            {MOCK_TEMPLATES.filter(t => t.status === 'Approved').map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedTemplate && (
                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4">
                    <div className="text-sm">
                        <Label className="text-gray-500 mb-1 block">Message Preview</Label>
                        <p className="text-gray-800 dark:text-gray-200 italic bg-white dark:bg-zinc-800 p-3 rounded border dark:border-zinc-700">
                            {selectedTemplate.body}
                        </p>
                    </div>
                    
                    {selectedTemplate.variables.length > 0 && (
                        <div className="space-y-3">
                             <Label className="text-xs font-bold uppercase text-gray-500">Variables</Label>
                             <div className="grid grid-cols-2 gap-3">
                                 {selectedTemplate.variables.map(v => (
                                     <div key={v}>
                                         <Input 
                                            placeholder={`Value for {{${v}}}`} 
                                            className="text-sm"
                                            value={variableValues[v] || ''}
                                            onChange={(e) => setVariableValues({...variableValues, [v]: e.target.value})}
                                         />
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} disabled={!newCampaignName || !selectedTemplateId || !selectedSegmentId} className="bg-green-600 hover:bg-green-700 text-white">
                Send Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default WhatsAppMarketingPage;

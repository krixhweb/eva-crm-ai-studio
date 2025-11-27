
import type { 
    Activity,
    Campaign,
    Customer,
    Deal,
    LowStockProduct,
    MarketingAutomation,
    Order,
    SalesActivity,
    SalesLead,
    SalesTask,
    ServiceAutomation,
    TeamMember,
    Workflow,
} from '../types';

// From mock/automation.ts
export const mockMarketingAutomations: MarketingAutomation[] = [
    { id: 1, name: "Abandoned Cart Recovery", iconName: 'shoppingCart', description: "3-email sequence to recover abandoned carts", status: "Active", trigger: "Cart abandoned for 1 hour", sent: 567, recovered: 184, revenue: 1845000, rate: 32.5 },
    { id: 2, name: "Welcome Series", iconName: 'users', description: "3 emails over 14 days for new customers", status: "Active", trigger: "New customer signup", sent: 1245, recovered: 623, revenue: 4520000, rate: 50.0 },
    { id: 3, name: "Post-Purchase Follow-Up", iconName: 'gift', description: "Review request + product recommendations", status: "Active", trigger: "7 days after purchase", sent: 892, recovered: 267, revenue: 1234000, rate: 29.9 },
    { id: 4, name: "Win-Back Campaign", iconName: 'trendingUp', description: "Re-engage customers inactive for 90 days", status: "Paused", trigger: "90 days no activity", sent: 234, recovered: 42, revenue: 568000, rate: 17.9 },
];

export const mockWorkflows: Workflow[] = [
    { id: 1, name: "Welcome Email Series", type: "Marketing", status: "Active", trigger: "Customer Signup", actions: 3, runs: 1245, saved: "42h", success: 98.5 },
    { id: 2, name: "Cart Abandonment", type: "Sales", status: "Active", trigger: "Cart Abandoned", actions: 4, runs: 567, saved: "18h", success: 92.3 },
    { id: 3, name: "Support Ticket Auto-Response", type: "Support", status: "Active", trigger: "New Ticket", actions: 2, runs: 2341, saved: "86h", success: 100 },
    { id: 4, name: "VIP Customer Alerts", type: "CRM", status: "Active", trigger: "High Value Purchase", actions: 5, runs: 89, saved: "12h", success: 95.5 },
];

export const mockServiceAutomations: ServiceAutomation[] = [
    { id: 1, name: "Auto-Response", iconName: 'messageSquare', description: "Instant reply to new tickets", status: "Active", trigger: "New ticket created", runs: 2341, saved: 86, success: 100 },
    { id: 2, name: "SLA Escalation", iconName: 'alertCircle', description: "Alert managers when SLA at risk", status: "Active", trigger: "SLA breach imminent", runs: 145, saved: 24, success: 97.2 },
    { id: 3, name: "Follow-Up After Resolution", iconName: 'checkCircle', description: "Send CSAT survey after ticket closure", status: "Active", trigger: "Ticket resolved", runs: 892, saved: 45, success: 94.5 },
    { id: 4, name: "Auto-Close Inactive", iconName: 'clock', description: "Close tickets with no response for 5 days", status: "Active", trigger: "5 days no customer response", runs: 234, saved: 18, success: 100 },
    { id: 5, name: "VIP White-Glove", iconName: 'trendingUp', description: "Priority handling for VIP customers", status: "Active", trigger: "VIP customer creates ticket", runs: 67, saved: 12, success: 100 },
];

// From mock/commerce.ts
export const mockLowStockProducts: LowStockProduct[] = [
  { id: 'P001', name: 'Wireless Headphones', stock: 8, icon: 'headphones' },
  { id: 'P002', name: 'Smart Watch Pro', stock: 5, icon: 'watch' },
  { id: 'P003', name: 'USB-C Hub Adapter', stock: 12, icon: 'usb' },
];

export const mockOrders: Order[] = [
    { id: 'ORD-789', date: '2024-07-18', items: [ {id: 'p1', name: 'Product A', quantity: 2, price: 5000}, {id: 'p2', name: 'Product B', quantity: 1, price: 14999}], amount: 24999, status: 'Processing' },
    { id: 'ORD-654', date: '2024-06-25', items: [], amount: 18500, status: 'Delivered' },
    { id: 'ORD-555', date: '2024-06-10', items: [], amount: 32000, status: 'Delivered' },
];

export const mockOrderManagement = {
  orders: [
    { id: "#ORD-1001", date: "2024-01-15", customer: "John Doe", items: 3, total: 45997, payment: "Paid", fulfillment: "Shipped" },
    { id: "#ORD-1002", date: "2024-01-15", customer: "Jane Smith", items: 1, total: 29999, payment: "Paid", fulfillment: "Delivered" },
    { id: "#ORD-1003", date: "2024-01-14", customer: "Bob Johnson", items: 5, total: 72495, payment: "Pending", fulfillment: "Processing" },
    { id: "#ORD-1004", date: "2024-01-14", customer: "Alice Williams", items: 2, total: 17998, payment: "Paid", fulfillment: "Shipped" },
    { id: "#ORD-1005", date: "2024-01-13", customer: "Charlie Brown", items: 4, total: 58996, payment: "Paid", fulfillment: "Processing" },
    { id: "#ORD-1006", date: "2024-01-13", customer: "Diana Prince", items: 1, total: 12999, payment: "Failed", fulfillment: "Cancelled" },
    { id: "#ORD-1007", date: "2024-01-12", customer: "Edward Norton", items: 3, total: 38997, payment: "Paid", fulfillment: "Delivered" },
    { id: "#ORD-1008", date: "2024-01-12", customer: "Fiona Green", items: 2, total: 24998, payment: "Paid", fulfillment: "Shipped" },
    { id: "#ORD-1009", date: "2024-01-11", customer: "George Harris", items: 6, total: 89494, payment: "Paid", fulfillment: "Processing" },
    { id: "#ORD-1010", date: "2024-01-11", customer: "Helen Clark", items: 1, total: 7999, payment: "Pending", fulfillment: "Processing" },
  ]
};

export const mockFinancials = {
  quotes: [
    { id: "QT-1001", date: "2024-01-15", customer: "Acme Corp", validUntil: "2024-02-15", amount: 1250000, status: "Sent", acceptance: 85 },
    { id: "QT-1002", date: "2024-01-14", customer: "TechStart Inc", validUntil: "2024-02-14", amount: 890000, status: "Accepted", acceptance: 100 },
    { id: "QT-1003", date: "2024-01-13", customer: "Global Solutions", validUntil: "2024-02-13", amount: 1560000, status: "Draft", acceptance: 0 },
    { id: "QT-1004", date: "2024-01-12", customer: "Digital Agency", validUntil: "2024-02-12", amount: 675000, status: "Expired", acceptance: 45 },
  ],
  invoices: [
    { id: "INV-2001", issued: "2024-01-10", due: "2024-02-10", customer: "Acme Corp", amount: 1250000, paid: 1250000, balance: 0, status: "Paid", overdue: 0 },
    { id: "INV-2002", issued: "2024-01-08", due: "2024-02-08", customer: "TechStart Inc", amount: 890000, paid: 445000, balance: 445000, status: "Partial", overdue: 0 },
    { id: "INV-2003", issued: "2024-01-05", due: "2024-01-20", customer: "Global Solutions", amount: 1560000, paid: 0, balance: 1560000, status: "Overdue", overdue: 10 },
    { id: "INV-2004", issued: "2024-01-03", due: "2024-02-03", customer: "Digital Agency", amount: 675000, paid: 0, balance: 675000, status: "Sent", overdue: 0 },
  ],
  payments: [
    { date: "2024-01-15", id: "PAY-5001", invoice: "INV-2001", customer: "Acme Corp", amount: 1250000, method: "Credit Card", reference: "CH-12345", status: "Completed", account: "Main" },
    { date: "2024-01-12", id: "PAY-5002", invoice: "INV-2002", customer: "TechStart Inc", amount: 445000, method: "Bank Transfer", reference: "BT-67890", status: "Completed", account: "Main" },
    { date: "2024-01-10", id: "PAY-5003", invoice: "INV-2004", customer: "Digital Agency", amount: 337500, method: "PayPal", reference: "PP-11223", status: "Pending", account: "Main" },
  ]
};

// From mock/customers.ts
export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    phone: '+91 98765 43210',
    status: 'Active',
    orders: 12,
    totalSpent: 196000,
    customerSince: '2022-01-15',
    tags: ['VIP', 'Tech Enthusiast'],
    leadOwner: { name: 'Priya Patel', avatar: 'PP' },
    leadStatus: 'Won',
    lastContacted: '2024-07-15',
    address: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
    company: { name: 'Sharma Enterprises', industry: 'Retail' },
    tickets: [
        { id: 'TKT-101', subject: 'Issue with wireless headphones', status: 'Solved', lastUpdate: '2024-07-10' },
        { id: 'TKT-105', subject: 'Delivery delay for order #ORD-555', status: 'Open', lastUpdate: '2024-07-20' },
    ],
    notes: [
        { id: 'NOTE-01', content: 'Customer called to inquire about bulk discounts. Interested in corporate gifting.', author: 'Priya Patel', date: '2024-06-25' }
    ],
    segment: 'Champions'
  },
  {
    id: 'CUST-002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    status: 'Active',
    orders: 8,
    totalSpent: 142500,
    customerSince: '2022-03-20',
    tags: ['Loyal Customer'],
    leadOwner: { name: 'Rohan Kumar', avatar: 'RK' },
    leadStatus: 'Contacted',
    lastContacted: '2024-07-18',
    address: { street: '456 CG Road', city: 'Ahmedabad', state: 'Gujarat', postalCode: '380009' },
    tickets: [],
    notes: [],
    segment: 'Loyal Customers'
  },
  {
    id: 'CUST-003',
    name: 'Rohan Kumar',
    email: 'rohan.kumar@example.com',
    phone: '+91 87654 32109',
    status: 'Inactive',
    orders: 3,
    totalSpent: 45000,
    customerSince: '2023-05-10',
    tags: ['At Risk'],
    leadOwner: { name: 'Ananya Singh', avatar: 'AS' },
    leadStatus: 'New Lead',
    lastContacted: '2024-02-01',
    address: { street: '789 Indiranagar', city: 'Bengaluru', state: 'Karnataka', postalCode: '560038' },
    tickets: [{ id: 'TKT-102', subject: 'Refund request', status: 'Closed', lastUpdate: '2024-01-15' }],
    notes: [],
    segment: 'At Risk'
  },
  {
    id: 'CUST-004',
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    phone: '+91 76543 21098',
    status: 'Active',
    orders: 25,
    totalSpent: 315000,
    customerSince: '2021-11-05',
    tags: ['VIP', 'Early Adopter'],
    leadOwner: { name: 'Priya Patel', avatar: 'PP' },
    leadStatus: 'Won',
    lastContacted: '2024-07-21',
    address: { street: '101 DLF CyberCity', city: 'Gurugram', state: 'Haryana', postalCode: '122002' },
    tickets: [],
    notes: [],
    segment: 'Champions'
  },
  {
    id: 'CUST-005',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phone: '+91 99887 76655',
    status: 'Active',
    orders: 5,
    totalSpent: 89000,
    customerSince: '2023-08-12',
    tags: ['Potential Loyalist'],
    leadOwner: { name: 'Rohan Kumar', avatar: 'RK' },
    leadStatus: 'Qualified',
    lastContacted: '2024-07-12',
    address: { street: '21 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', postalCode: '500033' },
    tickets: [{ id: 'TKT-103', subject: 'Product query', status: 'Pending', lastUpdate: '2024-07-19' }],
    notes: [],
    segment: 'Potential Loyalists'
  },
    { id: 'CUST-006', name: 'Siddharth Rao', email: 'sid.rao@example.com', phone: '+91 91122 33445', status: 'Active', orders: 15, totalSpent: 210000, customerSince: '2022-02-28', tags: ['VIP'], leadOwner: { name: 'Priya Patel', avatar: 'PP' }, leadStatus: 'Won', lastContacted: '2024-07-20', address: { street: 'Plot 45, Hitec City', city: 'Hyderabad', state: 'Telangana', postalCode: '500081' }, tickets: [], notes: [], segment: 'Champions' },
    { id: 'CUST-007', name: 'Neha Sharma', email: 'neha.s@example.com', phone: '+91 88877 66554', status: 'Inactive', orders: 2, totalSpent: 15000, customerSince: '2023-11-01', tags: [], leadOwner: { name: 'Rohan Kumar', avatar: 'RK' }, leadStatus: 'Lost', lastContacted: '2024-01-10', address: { street: 'A-1, Sector 62', city: 'Noida', state: 'Uttar Pradesh', postalCode: '201301' }, tickets: [], notes: [], segment: 'Lost' },
    { id: 'CUST-008', name: 'Aditya Verma', email: 'aditya.v@example.com', phone: '+91 77766 55443', status: 'Active', orders: 7, totalSpent: 95000, customerSince: '2023-01-05', tags: ['Loyal Customer'], leadOwner: { name: 'Ananya Singh', avatar: 'AS' }, leadStatus: 'Contacted', lastContacted: '2024-07-19', address: { street: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', postalCode: '400050' }, tickets: [], notes: [], segment: 'Loyal Customers' },
    { id: 'CUST-009', name: 'Kavita Iyer', email: 'kavita.iyer@example.com', phone: '+91 90080 07006', status: 'Active', orders: 4, totalSpent: 62000, customerSince: '2023-09-20', tags: ['Potential Loyalist'], leadOwner: { name: 'Priya Patel', avatar: 'PP' }, leadStatus: 'Qualified', lastContacted: '2024-07-15', address: { street: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', postalCode: '600040' }, tickets: [], notes: [], segment: 'Potential Loyalists' },
];

// From mock/marketing.ts
export const mockCampaigns: Campaign[] = [
  { id: 'camp1', name: 'Summer Sale Spectacle', status: 'Active', image: 'https://images.unsplash.com/photo-1504890001746-a9a68eda46e2?q=80&w=300', platforms: ['Facebook', 'Instagram'], metrics: { impressions: 45.2, clicks: 2300, conversions: 120, spend: 50000, roi: 450 } },
  { id: 'camp2', name: 'Monsoon Mania Deals', status: 'Completed', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=300', platforms: ['Twitter'], metrics: { impressions: 22.1, clicks: 1100, conversions: 45, spend: 25000, roi: 280 } },
  { id: 'camp3', name: 'Diwali Dhamaka Offers', status: 'Scheduled', image: 'https://images.unsplash.com/photo-1572455044234-22d39994c86b?q=80&w=300', platforms: ['Facebook', 'Instagram', 'TikTok'], metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 0, roi: 0 } },
  { id: 'camp4', name: 'New Year New Gear', status: 'Paused', image: 'https://images.unsplash.com/photo-1517420704952-d9219d2d1412?q=80&w=300', platforms: ['TikTok'], metrics: { impressions: 15.6, clicks: 850, conversions: 30, spend: 18000, roi: 150 } },
  { id: 'camp5', name: 'Clearance Sale', status: 'Active', image: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=300', platforms: ['Instagram'], metrics: { impressions: 62.5, clicks: 3500, conversions: 250, spend: 75000, roi: 600 } },
  { id: 'camp6', name: 'Back to School', status: 'Completed', image: 'https://images.unsplash.com/photo-1560780552-ba5468389472?q=80&w=300', platforms: ['Facebook'], metrics: { impressions: 31.0, clicks: 1500, conversions: 80, spend: 30000, roi: 350 } },
];

export const mockAbandonedCarts = [
    { id: 'c1', customer: 'Arjun Sharma', email: 'arjun.sharma@example.com', value: 10040, items: 3, abandoned: '2 hours ago', status: 'New'},
    { id: 'c2', customer: 'Priya Patel', email: 'priya.patel@example.com', value: 7120, items: 2, abandoned: '5 hours ago', status: 'Email Sent'},
    { id: 'c3', customer: 'Rohan Kumar', email: 'rohan.kumar@example.com', value: 20000, items: 5, abandoned: '1 day ago', status: 'Recovered'},
    { id: 'c4', customer: 'Ananya Singh', email: 'ananya.singh@example.com', value: 3660, items: 1, abandoned: '2 days ago', status: 'Lost'},
];

export const mockCartRecoveryCampaigns = [
    {
      id: 1,
      name: "Standard Cart Recovery",
      status: 'active' as 'active' | 'paused',
      trigger: "Cart abandoned for 1 hour",
      emails: [
        { subject: "Did you forget something?", delay: "1 hour", openRate: 42.5, clickRate: 15.2 },
        { subject: "Your cart is about to expire", delay: "24 hours", openRate: 35.1, clickRate: 10.8 },
        { subject: "We're holding your items for you", delay: "3 days", openRate: 28.9, clickRate: 8.1 },
      ],
      recovered: 184,
      revenue: 1845000,
      rate: 32.5,
    },
    {
      id: 2,
      name: "High-Value Cart Recovery",
      status: 'paused' as 'active' | 'paused',
      trigger: "Cart value > ₹10,000 abandoned",
      emails: [
        { subject: "A special offer for your cart...", delay: "30 minutes", openRate: 55.2, clickRate: 22.1 },
        { subject: "Don't miss out on these items!", delay: "12 hours", openRate: 48.3, clickRate: 18.5 },
      ],
      recovered: 78,
      revenue: 950000,
      rate: 45.2,
    }
  ];

// From mock/sales.ts
export const mockDeals: Deal[] = [
    { id: 'deal-9', company: 'Future Inc', contactPerson: 'Nia Sharma', description: 'AI chatbot integration', value: 22000, probability: 10, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 6, priority: "low", stage: "Lead Gen", comments: 0, attachments: 0, dueDate: '2024-09-10' },
    { id: 'deal-10', company: 'NextGen Co', contactPerson: 'Omar Abdullah', description: 'Social media management', value: 16000, probability: 10, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 9, priority: "low", stage: "Lead Gen", comments: 0, attachments: 0, dueDate: '2024-09-15' },
    { id: 'deal-13', company: 'Alpha Widgets', contactPerson: 'Priya Singh', description: 'Initial inquiry for widget supply', value: 12000, probability: 5, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 2, priority: "low", stage: "Lead Gen", comments: 0, attachments: 0, dueDate: '2024-09-20' },
    { id: 'deal-14', company: 'Beta Services', contactPerson: 'Raj Patel', description: 'Downloaded e-book on marketing', value: 8000, probability: 5, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 3, priority: "low", stage: "Lead Gen", comments: 0, attachments: 0, dueDate: '2024-09-22' },
    { id: 'deal-15', company: 'Gamma Tech', contactPerson: 'Sonia Gupta', description: 'Website contact form submission', value: 15000, probability: 10, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 1, priority: "medium", stage: "Lead Gen", comments: 0, attachments: 0, dueDate: '2024-09-25' },
    { id: 'deal-7', company: 'MegaCorp', contactPerson: 'Tara Khanna', description: 'Logistics management system', value: 38000, probability: 25, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 10, priority: "medium", stage: "Qualification", comments: 0, attachments: 0, dueDate: '2024-09-01' },
    { id: 'deal-8', company: 'TechStart', contactPerson: 'Umar Farooq', description: 'Website redesign', value: 19500, probability: 35, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 18, priority: "low", stage: "Qualification", comments: 1, attachments: 1, dueDate: '2024-09-05' },
    { id: 'deal-16', company: 'Delta Solutions', contactPerson: 'Vani Kapoor', description: 'Follow-up call after webinar', value: 25000, probability: 30, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 4, priority: "medium", stage: "Qualification", comments: 1, attachments: 0, dueDate: '2024-09-18' },
    { id: 'deal-17', company: 'Epsilon LLC', contactPerson: 'Waseem Khan', description: 'Discovery call scheduled', value: 42000, probability: 40, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 2, priority: "high", stage: "Qualification", comments: 0, attachments: 0, dueDate: '2024-09-12' },
    { id: 'deal-18', company: 'Zeta Corp', contactPerson: 'Yusuf Ali', description: 'Budget and authority confirmed', value: 31000, probability: 45, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 8, priority: "medium", stage: "Qualification", comments: 2, attachments: 1, dueDate: '2024-09-10' },
    { id: 'deal-5', company: 'GlobalTech', contactPerson: 'Zoya Akhtar', description: 'Cybersecurity audit', value: 45000, probability: 60, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 3, priority: "high", stage: "Proposal", comments: 4, attachments: 1, dueDate: '2024-08-05' },
    { id: 'deal-6', company: 'InnovateCo', contactPerson: 'Anjali Menon', description: 'Custom mobile app development', value: 28000, probability: 65, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 7, priority: "high", stage: "Proposal", comments: 2, attachments: 2, dueDate: '2024-08-12' },
    { id: 'deal-19', company: 'Theta Industries', contactPerson: 'Bhavna Reddy', description: 'Proposal sent for hardware refresh', value: 75000, probability: 55, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 1, priority: "high", stage: "Proposal", comments: 0, attachments: 1, dueDate: '2024-08-20' },
    { id: 'deal-20', company: 'Iota Ventures', contactPerson: 'Chetan Kumar', description: 'Drafting contract for consulting', value: 20000, probability: 50, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 5, priority: "medium", stage: "Proposal", comments: 3, attachments: 2, dueDate: '2024-08-25' },
    { id: 'deal-21', company: 'Kappa Logistics', contactPerson: 'Divya Sharma', description: 'Submitted pricing for fleet mgmt', value: 62000, probability: 60, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 4, priority: "high", stage: "Proposal", comments: 1, attachments: 1, dueDate: '2024-08-18' },
    { id: 'deal-3', company: 'StartupX', contactPerson: 'Esha Gupta', description: 'Cloud infrastructure setup', value: 15000, probability: 75, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 12, priority: "medium", stage: "Demo", comments: 5, attachments: 3, dueDate: '2024-08-20' },
    { id: 'deal-4', company: 'Enterprise Co', contactPerson: 'Faisal Ahmed', description: 'Data analytics dashboard', value: 32000, probability: 70, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 15, priority: "medium", stage: "Demo", comments: 2, attachments: 0, dueDate: '2024-08-22' },
    { id: 'deal-22', company: 'Lambda Systems', contactPerson: 'Gita Nair', description: 'Product demo completed', value: 28000, probability: 80, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 3, priority: "high", stage: "Demo", comments: 4, attachments: 1, dueDate: '2024-08-15' },
    { id: 'deal-23', company: 'Mu Digital', contactPerson: 'Harish Iyer', description: 'Stakeholder demo scheduled', value: 19000, probability: 70, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 6, priority: "medium", stage: "Demo", comments: 1, attachments: 0, dueDate: '2024-08-28' },
    { id: 'deal-24', company: 'Nu Solutions', contactPerson: 'Imran Khan', description: 'Follow-up demo for technical team', value: 34000, probability: 75, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 2, priority: "high", stage: "Demo", comments: 3, attachments: 2, dueDate: '2024-08-21' },
    { id: 'deal-1', company: 'TechCorp Inc', contactPerson: 'John Doe', description: 'Enterprise software solution', value: 25000, probability: 90, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 5, priority: "high", stage: "Negotiation", comments: 3, attachments: 2, dueDate: '2024-08-10' },
    { id: 'deal-2', company: 'Digital Solutions', contactPerson: 'Jane Smith', description: 'Marketing automation platform', value: 18500, probability: 85, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 8, priority: "high", stage: "Negotiation", comments: 1, attachments: 1, dueDate: '2024-08-15' },
    { id: 'deal-25', company: 'Xi Enterprises', contactPerson: 'Kiran Rao', description: 'Finalizing terms, redlines received', value: 55000, probability: 95, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 3, priority: "high", stage: "Negotiation", comments: 5, attachments: 3, dueDate: '2024-08-08' },
    { id: 'deal-26', company: 'Omicron Media', contactPerson: 'Lalit Modi', description: 'Discount approval pending', value: 21000, probability: 85, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 6, priority: "medium", stage: "Negotiation", comments: 2, attachments: 1, dueDate: '2024-08-14' },
    { id: 'deal-27', company: 'Pi Analytics', contactPerson: 'Meena Kumari', description: 'Legal review in progress', value: 48000, probability: 90, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 4, priority: "high", stage: "Negotiation", comments: 3, attachments: 2, dueDate: '2024-08-11' },
    { id: 'deal-11', company: 'Apex Solutions', contactPerson: 'Amitabh Bachchan', description: 'CRM implementation', value: 52000, probability: 100, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 2, priority: "high", stage: "Closed Won", comments: 8, attachments: 5, dueDate: '2024-07-20' },
    { id: 'deal-28', company: 'Rho Consulting', contactPerson: 'Priyanka Chopra', description: 'Management consulting package', value: 68000, probability: 100, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 1, priority: "high", stage: "Closed Won", comments: 6, attachments: 4, dueDate: '2024-07-25' },
    { id: 'deal-29', company: 'Sigma Security', contactPerson: 'Shah Rukh Khan', description: 'Annual security retainer', value: 95000, probability: 100, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 3, priority: "high", stage: "Closed Won", comments: 10, attachments: 6, dueDate: '2024-07-28' },
    { id: 'deal-12', company: 'Synergy Systems', contactPerson: 'Aishwarya Rai', description: 'Cloud migration service', value: 41000, probability: 0, assignees: [{name: 'John Doe', avatar: 'JD'}], daysInStage: 25, priority: "medium", stage: "Closed Lost", comments: 3, attachments: 1, dueDate: '2024-07-18' },
    { id: 'deal-30', company: 'Tau Manufacturing', contactPerson: 'Deepika Padukone', description: 'Went with competitor', value: 33000, probability: 0, assignees: [{name: 'Priya Patel', avatar: 'PP'}], daysInStage: 30, priority: "medium", stage: "Closed Lost", comments: 4, attachments: 2, dueDate: '2024-07-22' },
    { id: 'deal-31', company: 'Upsilon Software', contactPerson: 'Ranveer Singh', description: 'Project cancelled internally', value: 27000, probability: 0, assignees: [{name: 'Rohan Kumar', avatar: 'RK'}], daysInStage: 22, priority: "low", stage: "Closed Lost", comments: 1, attachments: 1, dueDate: '2024-07-26' },
];

export const mockSalesActivities: SalesActivity[] = [
    { id: 'sa1', type: 'DEAL_WON', title: 'Closed deal with Sharma Enterprises', user: { name: 'Priya Patel', avatar: 'PP' }, relatedCustomer: { id: 'CUST-001', name: 'Arjun Sharma' }, details: 'Value: ₹5,00,000 | Product: Bulk Headphone Order', timestamp: '2 days ago' },
    { id: 'sa2', type: 'MEETING', title: 'Discovery call with potential client', user: { name: 'Rohan Kumar', avatar: 'RK' }, details: 'Scheduled for 25th July, 2024', timestamp: '3 days ago' },
    { id: 'sa3', type: 'CALL', title: 'Follow-up call with Ananya Singh', user: { name: 'Priya Patel', avatar: 'PP' }, relatedCustomer: { id: 'CUST-004', name: 'Ananya Singh' }, details: 'Discussed renewal options. Positive response.', timestamp: '4 days ago' },
    { id: 'sa4', type: 'TASK', title: 'Prepare proposal for Vikram Mehta', user: { name: 'Rohan Kumar', avatar: 'RK' }, relatedCustomer: { id: 'CUST-005', name: 'Vikram Mehta' }, details: 'Due: 22nd July, 2024', timestamp: '5 days ago' },
    { id: 'sa5', type: 'EMAIL', title: 'Sent introductory email to New Lead', user: { name: 'Ananya Singh', avatar: 'AS' }, details: 'Subject: Exploring Synergies with EVA CRM', timestamp: '6 days ago' },
];

export const mockTeamMembers: TeamMember[] = [
    { id: 'tm1', name: 'Priya Patel', avatar: 'PP', dealsClosed: 42, revenue: 1250000 },
    { id: 'tm2', name: 'Rohan Kumar', avatar: 'RK', dealsClosed: 35, revenue: 980000 },
    { id: 'tm3', name: 'Ananya Singh', avatar: 'AS', dealsClosed: 28, revenue: 820000 },
    { id: 'tm4', name: 'John Doe', avatar: 'JD', dealsClosed: 50, revenue: 1500000 },
];

export const mockSalesTasks: SalesTask[] = [
    { id: 'st1', title: 'Follow up with Aditya Verma', dueDate: '2024-07-22', isOverdue: false, priority: 'High', status: 'Open' },
    { id: 'st2', title: 'Send proposal to Kavita Iyer', dueDate: '2024-07-21', isOverdue: false, priority: 'Medium', status: 'Completed' },
    { id: 'st3', title: 'Schedule demo for New Lead Co', dueDate: '2024-07-19', isOverdue: true, priority: 'High', status: 'Overdue' },
];

export const mockSalesLeads: SalesLead[] = [
    { id: 'sl1', name: 'Aarav Gupta', company: 'Innovate Solutions', value: 500000, owner: { name: 'Priya Patel', avatar: 'PP' }, lastContacted: '2024-07-20' },
    { id: 'sl2', name: 'Isha Reddy', company: 'Digital Transformations', value: 750000, owner: { name: 'Rohan Kumar', avatar: 'RK' }, lastContacted: '2024-07-18' },
    { id: 'sl3', name: 'Kabir Khan', company: 'Global Exports', value: 350000, owner: { name: 'Ananya Singh', avatar: 'AS' }, lastContacted: '2024-07-19' },
];

// From mock/shared.ts
export const mockActivities: Activity[] = [
  { id: 'act1', title: 'Order Placed', timestamp: '2 days ago', type: 'Order', details: { orderId: 'ORD-789', items: 3, value: '₹24,999', status: 'Processing' } },
  { id: 'act2', title: 'Support Ticket Created', timestamp: '3 days ago', type: 'Ticket', details: { ticketId: 'TKT-105', subject: 'Delivery delay for order #ORD-555', status: 'Open' } },
  { id: 'act3', title: 'Abandoned Cart', timestamp: '5 days ago', type: 'Cart', details: { items: 2, value: '₹7,120' } },
  { id: 'act4', title: 'Profile Updated', timestamp: '1 week ago', type: 'Profile', details: { from: 'arjun.s@old.com', to: 'arjun.sharma@example.com' } },
  { id: 'act5', title: 'Login from new device', timestamp: '2 weeks ago', type: 'Login', details: { ipAddress: '103.22.201.135', device: 'Chrome on Windows', location: 'Mumbai, IN' } },
  { id: 'act6', title: 'Viewed Product', timestamp: '2 weeks ago', type: 'PageView', details: { productName: 'Smart Watch Pro', productId: 'P002', url: '/products/smart-watch-pro' } },
];

export const mockCommunications = [
    { id: 'comm1', channel: 'Email', subject: 'Your order #ORD-789 has been shipped!', preview: 'Hi Arjun, great news! Your recent order containing Wireless Headphones...', timestamp: '1 day ago', direction: 'Sent' },
    { id: 'comm2', channel: 'SMS', subject: 'Delivery Update', preview: 'Your EVA CRM order is out for delivery. Track here: eva.short.link/xyz', timestamp: '2 days ago', direction: 'Sent' },
    { id: 'comm3', channel: 'Phone', subject: 'Follow-up on bulk discount inquiry', preview: 'Call with Priya Patel regarding corporate gifting options.', timestamp: '3 weeks ago', direction: 'Sent' },
    { id: 'comm4', channel: 'Chat', subject: 'Question about product compatibility', preview: 'Customer asked if the USB-C hub is compatible with...', timestamp: '1 month ago', direction: 'Received' },
];

// From mock/support.ts
export const mockTickets = [
    { id: "T-1001", status: "Open", priority: "High", subject: "Payment not processing", customer: "John Doe", assigned: "Sarah K.", channel: "Email", created: "2 hours ago", updated: "30 mins ago", sla: "2h left" },
    { id: "T-1002", status: "Pending", priority: "Medium", subject: "Shipping inquiry", customer: "Jane Smith", assigned: "Mike R.", channel: "Chat", created: "5 hours ago", updated: "1 hour ago", sla: "4h left" },
    { id: "T-1003", status: "Resolved", priority: "Low", subject: "Product question", customer: "Bob Johnson", assigned: "Lisa T.", channel: "Phone", created: "1 day ago", updated: "3 hours ago", sla: "Resolved" },
    { id: "T-1004", status: "Open", priority: "High", subject: "Account access issue", customer: "Alice W.", assigned: "Tom B.", channel: "Email", created: "1 hour ago", updated: "45 mins ago", sla: "3h left" },
    { id: "T-1005", status: "Pending", priority: "Medium", subject: "Refund request", customer: "Charlie B.", assigned: "Sarah K.", channel: "Social", created: "3 hours ago", updated: "2 hours ago", sla: "6h left" },
];

export const mockReturns = [
    { id: "RET-501", orderId: "ORD-985", date: "2024-01-14", customer: "Mike Johnson", items: 2, amount: 19998, reason: "Defective", status: "Approved", daysOpen: 2 },
    { id: "RET-502", orderId: "ORD-892", date: "2024-01-12", customer: "Sarah Lee", items: 1, amount: 8999, reason: "Wrong Size", status: "Pending", daysOpen: 4 },
    { id: "RET-503", orderId: "ORD-756", date: "2024-01-10", customer: "Tom Wilson", items: 3, amount: 35997, reason: "Changed Mind", status: "Completed", daysOpen: 6 },
    { id: "RET-504", orderId: "ORD-623", date: "2024-01-08", customer: "Emily Davis", items: 1, amount: 12999, reason: "Not as Described", status: "Approved", daysOpen: 8 },
    { id: "RET-505", orderId: "ORD-511", date: "2024-01-06", customer: "David Brown", items: 2, amount: 24998, reason: "Damaged in Transit", status: "Rejected", daysOpen: 10 },
];

// FIX: Add missing rfmSegments mock data.
export const rfmSegments = [
    {
      name: "Champions",
      description: "Your best customers. They buy often and spend the most.",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600",
      percentage: 15,
      count: 185,
      avgSpend: 45000,
      avgFrequency: 12,
      lastPurchaseAvg: 15,
    },
    {
      name: "Loyal Customers",
      description: "Consistent buyers. Nurture them for growth.",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600",
      percentage: 25,
      count: 310,
      avgSpend: 28000,
      avgFrequency: 6,
      lastPurchaseAvg: 45,
    },
    {
      name: "At Risk",
      description: "High value, but haven't purchased in a while. Needs re-engagement.",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600",
      percentage: 18,
      count: 223,
      avgSpend: 32000,
      avgFrequency: 5,
      lastPurchaseAvg: 120,
    },
    {
      name: "Lost",
      description: "Customers who have churned. Minimal engagement.",
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600",
      percentage: 12,
      count: 148,
      avgSpend: 15000,
      avgFrequency: 2,
      lastPurchaseAvg: 380,
    },
];

// Data from pages

export const mockDashboardRevenueData = [
    { name: 'Jan', revenue: 40000, goal: 50000 },
    { name: 'Feb', revenue: 30000, goal: 50000 },
    { name: 'Mar', revenue: 50000, goal: 52000 },
    { name: 'Apr', revenue: 45000, goal: 55000 },
    { name: 'May', revenue: 60000, goal: 58000 },
    { name: 'Jun', revenue: 55000, goal: 60000 },
    { name: 'Jul', revenue: 75000, goal: 65000 },
];
  
export const mockDashboardAcquisitionData = [
      { name: 'Organic', value: 45, color: '#3B82F6' },
      { name: 'Paid Ads', value: 25, color: '#10B981' },
      { name: 'Social', value: 20, color: '#F59E0B' },
      { name: 'Referral', value: 10, color: '#8B5CF6' },
];
  
export const mockDashboardFunnelData = [
      { name: 'Purchase', value: 1247 },
      { name: 'Checkout', value: 2105 },
      { name: 'Add to Cart', value: 3560 },
      { name: 'Visitors', value: 15230 },
];
  
export const mockDashboardTopProducts = [
    { name: 'Wireless Headphones', sales: 1240, revenue: 3100000 },
    { name: 'Smart Watch Pro', sales: 890, revenue: 2670000 },
    { name: 'USB-C Hub Adapter', sales: 650, revenue: 1300000 },
];
  
export const mockDashboardRecentOrders = [
    { id: 'ORD-001', customer: 'Arjun Sharma', status: 'Delivered', amount: 24999 },
    { id: 'ORD-002', customer: 'Priya Patel', status: 'Processing', amount: 18950 },
    { id: 'ORD-003', customer: 'Rohan Kumar', status: 'Pending', amount: 45000 },
    { id: 'ORD-004', customer: 'Ananya Singh', status: 'Cancelled', amount: 29999 },
];

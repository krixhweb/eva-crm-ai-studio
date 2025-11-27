
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Company {
  name: string;
  industry: string;
}

export interface Attachment {
  name: string;
  url: string;
}

// Common Audit Interface
export interface AuditMetadata {
  createdBy?: string;
  createdByName?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedByName?: string;
  updatedAt?: string;
}

export interface Note extends AuditMetadata {
  id: string;
  content: string;
  author: string;
  date: string;
  attachments?: Attachment[];
}

export interface Ticket {
  id:string;
  subject: string;
  status: 'Open' | 'Pending' | 'Solved' | 'Closed';
  lastUpdate: string;
}

export interface Customer extends AuditMetadata {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  orders: number;
  totalSpent: number;
  customerSince: string;
  tags: string[];
  leadOwner: {
    name: string;
    avatar: string;
  };
  leadStatus: string;
  lastContacted: string;
  address: Address;
  company?: Company;
  tickets: Ticket[];
  notes: Note[];
  segment: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  amount: number;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Cancelled';
}

export interface ActivityDetailsOrder {
    orderId: string;
    items: number;
    value: string;
    status: string;
}

export interface ActivityDetailsTicket {
    ticketId: string;
    subject: string;
    status: string;
}

export interface ActivityDetailsProfile {
    from: string;
    to: string;
}

export interface ActivityDetailsCart {
    items: number;
    value: string;
}

export interface ActivityDetailsEmail {
    subject: string;
    campaign: string;
}

export interface ActivityDetailsLogin {
    ipAddress: string;
    device: string;
    location: string;
}

export interface ActivityDetailsPageView {
    productName: string;
    productId: string;
    url: string;
}

export interface Activity {
    id: string;
    title: string;
    timestamp: string;
    type: 'Order' | 'Ticket' | 'Profile' | 'Cart' | 'Email' | 'Login' | 'PageView';
    details: string | ActivityDetailsOrder | ActivityDetailsTicket | ActivityDetailsProfile | ActivityDetailsCart | ActivityDetailsEmail | ActivityDetailsLogin | ActivityDetailsPageView;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Paused';
  image: string;
  platforms: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    roi: number;
  };
}

export interface SalesActivity extends AuditMetadata {
  id: string;
  type: 'DEAL_WON' | 'MEETING' | 'CALL' | 'TASK' | 'EMAIL';
  title: string;
  user: {
    name: string;
    avatar: string;
  };
  relatedCustomer?: {
    id: string;
    name: string;
  };
  details: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  dealsClosed: number;
  revenue: number;
}

export interface SalesTask extends AuditMetadata {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // YYYY-MM-DD
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'Completed' | 'Overdue';
    assignee?: string;
    relatedLead?: string;
    tags?: string[];
    isOverdue?: boolean;
    completedBy?: string;
    completedByName?: string;
    completedAt?: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  icon: string;
}

export interface SalesLead {
    id: string;
    name: string;
    company: string;
    value: number;
    owner: {
        name: string;
        avatar: string;
    };
    lastContacted: string;
}

export interface Deal extends AuditMetadata {
  id: string;
  company: string;
  contactPerson?: string;
  description: string;
  value: number;
  dueDate: string;
  assignees: { name: string; avatar: string }[];
  comments: number;
  attachments: number;
  stage: string;
  priority: 'high' | 'medium' | 'low';
  probability: number;
  daysInStage: number;
  tags?: string[];
}

export interface MarketingAutomation {
  id: number;
  name: string;
  iconName: string;
  description: string;
  status: 'Active' | 'Paused';
  trigger: string;
  sent: number;
  recovered: number;
  revenue: number;
  rate: number;
}

export interface Workflow {
  id: number;
  name: string;
  type: 'Marketing' | 'Sales' | 'Support' | 'CRM';
  status: 'Active' | 'Paused';
  trigger: string;
  actions: number;
  runs: number;
  saved: string;
  success: number;
}

export interface ServiceAutomation {
  id: number;
  name: string;
  iconName: string;
  description: string;
  status: 'Active' | 'Paused';
  trigger: string;
  runs: number;
  saved: number;
  success: number;
}

export interface LeadFormData {
  templateType: "company" | "individual";
  companyName: string;
  firstName: string;
  lastName: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tags: string[];
  leadOwner: string;
  budget: string;
  stage: string;
  rating: "Hot" | "Warm" | "Cold";
  leadSource: string;
  description: string;
  preferredContact: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  tags: string[];
  description: string;
  images: string[];
  costPrice: number;
  sellingPrice: number;
  status: 'Active' | 'Inactive';
  locations: ProductLocationStock[];
  stock: number; // total stock
  lastUpdated?: string; // ISO Date string
}

export interface ProductLocationStock {
  locationId: string;
  locationName: string;
  stock: number;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface SalesOrder {
  id: string;
  customerName: string;
  orderDate: string;
  itemCount: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  status: 'Draft' | 'Pending' | 'Completed' | 'Shipped' | 'Cancelled';
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  createdDate: string;
  expectedDelivery: string;
  totalCost: number;
  status: 'Draft' | 'Approved' | 'Received' | 'Cancelled';
}

export interface ReturnRequest {
    id: string;
    orderId: string;
    customerName: string;
    reason: string;
    type: 'Refund' | 'Exchange';
    status: 'Requested' | 'Approved' | 'Completed' | 'Rejected';
}

export interface SupplierReturn {
    id: string;
    purchaseOrderId: string;
    supplierName: string;
    date: string;
    itemCount: number;
    amount: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Shipped' | 'Refunded';
    notes?: string;
}

export interface ShippingInfo {
    orderId: string;
    customerName: string;
    carrier: string | null;
    trackingNumber: string | null;
    status: 'Pending' | 'Packed' | 'Shipped' | 'In Transit' | 'Delivered';
    history: {
        status: string;
        date: string;
        location: string;
    }[];
}

// Financial Hub Types
export interface LineItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  quoteDate: string;
  validTill: string;
  lineItems: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
  terms: string;
  notes: string;
}

export interface Invoice {
  id: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue';
  terms: string;
  notes: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  method: 'Credit Card' | 'Bank Transfer' | 'UPI' | 'Cash';
  status: 'Completed' | 'Pending' | 'Failed';
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}
export type UserRole = 'client' | 'admin';

export interface FrequentlyUsedInfo {
  defaultBrandName?: string;
  brandWebsite?: string;
  brandColors?: string;
  targetAudience?: string;
  additionalNotes?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  company?: string;
  bio?: string;
  preferredCommunication?: 'Studio Direct Chat' | 'Email' | 'Scheduled Video Review';
  projectPreferences?: string[];
  designPreferences?: string[];
  frequentlyUsedInfo?: FrequentlyUsedInfo;
  savedWorkIds?: string[];
  savedServiceIds?: string[];
  recentlyViewedProjectIds?: string[];
  notificationSettings?: {
    emailUpdates: boolean;
    orderProgress: boolean;
    chatPings: boolean;
    studioNews: boolean;
  };
  createdAt: string;
}

export type OrderStatus = 
  | 'order_placed' 
  | 'request_reviewed' 
  | 'designing' 
  | 'first_preview' 
  | 'revision' 
  | 'final_design' 
  | 'delivered'
  // Backward compatibility aliases if any
  | 'request_received'
  | 'planning'
  | 'review'
  | 'revisions'
  | 'finalizing';

export interface DeliverableFile {
  id: string;
  name: string;
  size: string;
  type: string;
  downloadUrl: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  date: string;
  completed: boolean;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string;
  referenceLinks?: string[];
  status: OrderStatus;
  progress: number; // 0 to 100
  priority: 'standard' | 'rush' | 'exclusive';
  budgetRange: string;
  deadline: string;
  paymentStatus?: 'invoiced' | 'deposit_paid' | 'paid_in_full' | 'complimentary';
  invoiceAmount?: string;
  deliverables: DeliverableFile[];
  notes?: string;
  timeline: OrderTimelineEvent[];
  deliveryInformation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProject {
  id: string;
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  title: string;
  serviceName: string;
  status: 'active' | 'in_review' | 'completed';
  progress: number;
  coverImage?: string;
  deliverables: DeliverableFile[];
  brief: string;
  milestones: { title: string; date: string; completed: boolean }[];
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  orderId?: string;
  orderTitle?: string;
  lastMessage: string;
  lastMessageSender: string;
  lastMessageTime: string;
  unreadByAdmin: number;
  unreadByClient: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachments?: { name: string; url: string; type: string }[];
  orderId?: string;
  createdAt: string;
  read: boolean;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: 'Posters' | 'Invitations' | 'Advertisements' | 'Logos' | 'Social Media' | 'Video' | 'Custom';
  shortDesc: string;
  fullDesc: string;
  client: string;
  year: string;
  coverImage: string;
  gallery: string[];
  deliverables: string[];
  creativeProcess: string;
  featured: boolean;
  tags: string[];
  accentColor: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  turnaroundTime: string;
  startingPrice: string;
  iconName: string;
  sampleImage: string;
  featured: boolean;
  active: boolean;
  accentGradient: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 
    | 'order_placed' 
    | 'status_change' 
    | 'preview_ready' 
    | 'revision_update' 
    | 'delivered' 
    | 'message' 
    | 'announcement'
    | 'order_update'
    | 'milestone'
    | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

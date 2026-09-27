import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  Order, 
  OrderStatus, 
  ClientProject,
  Conversation, 
  ChatMessage, 
  PortfolioProject, 
  ServiceItem, 
  NotificationItem, 
  DeliverableFile,
  OrderTimelineEvent
} from '../types';
import { INITIAL_PORTFOLIO, INITIAL_SERVICES, initializeFirestoreSeedData } from '../services/seedData';

interface AppContextType {
  orders: Order[];
  projects: ClientProject[];
  services: ServiceItem[];
  portfolio: PortfolioProject[];
  conversations: Conversation[];
  activeConversationMessages: ChatMessage[];
  notifications: NotificationItem[];
  savedWorkIds: string[];
  recentlyViewedProjects: PortfolioProject[];
  selectedConversationId: string | null;
  loadingOrders: boolean;
  loadingProjects: boolean;
  loadingServices: boolean;
  loadingPortfolio: boolean;
  setSelectedConversationId: (id: string | null) => void;
  createOrder: (orderData: Partial<Order>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus, progress?: number, notes?: string) => Promise<void>;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => Promise<void>;
  addDeliverableToOrder: (orderId: string, file: DeliverableFile) => Promise<void>;
  sendMessage: (conversationId: string, text: string, orderId?: string) => Promise<void>;
  getOrCreateConversationForClient: (clientId: string, clientName: string, clientEmail: string, orderId?: string, orderTitle?: string) => Promise<string>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  toggleSaveWork: (projectId: string) => Promise<void>;
  recordRecentlyViewed: (projectId: string) => void;
  addPortfolioProject: (project: PortfolioProject) => Promise<void>;
  updatePortfolioProject: (id: string, updates: Partial<PortfolioProject>) => Promise<void>;
  deletePortfolioProject: (id: string) => Promise<void>;
  updateServiceItem: (id: string, updates: Partial<ServiceItem>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// The exact 7-step status pipeline requested by the user
export const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; defaultProgress: number; description: string }[] = [
  { 
    status: 'order_placed', 
    label: 'Order Placed', 
    defaultProgress: 15, 
    description: 'Commission parameters logged and secured in studio production pipeline.' 
  },
  { 
    status: 'request_reviewed', 
    label: 'Request Reviewed', 
    defaultProgress: 30, 
    description: 'Studio creative director reviewed brief & assigned dedicated lead artist.' 
  },
  { 
    status: 'designing', 
    label: 'Designing', 
    defaultProgress: 50, 
    description: 'High-fidelity visual development, Swiss typography, & color architecture.' 
  },
  { 
    status: 'first_preview', 
    label: 'First Preview', 
    defaultProgress: 70, 
    description: 'Initial concept draft proof delivered to your client portal for review.' 
  },
  { 
    status: 'revision', 
    label: 'Revision', 
    defaultProgress: 85, 
    description: 'Implementing client refinement notes, optical kerning, & finish tests.' 
  },
  { 
    status: 'final_design', 
    label: 'Final Design', 
    defaultProgress: 95, 
    description: 'Master color space grading, 300DPI vector press prep & asset packaging.' 
  },
  { 
    status: 'delivered', 
    label: 'Delivered', 
    defaultProgress: 100, 
    description: 'All production-grade master deliverables and rights handed over.' 
  },
];

// Helper to normalize legacy statuses if encountered
export function normalizeOrderStatus(status: string): OrderStatus {
  if (status === 'request_received') return 'order_placed';
  if (status === 'planning') return 'request_reviewed';
  if (status === 'review') return 'first_preview';
  if (status === 'revisions') return 'revision';
  if (status === 'finalizing') return 'final_design';
  return (status as OrderStatus) || 'order_placed';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, updateUserProfileData, isAdmin } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationMessages, setActiveConversationMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [savedWorkIds, setSavedWorkIds] = useState<string[]>([]);
  const [recentViewIds, setRecentViewIds] = useState<string[]>([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  // Initialize Firestore seed data on mount
  useEffect(() => {
    initializeFirestoreSeedData();
  }, []);

  // Sync savedWorkIds from user profile
  useEffect(() => {
    if (userProfile?.savedWorkIds) {
      setSavedWorkIds(userProfile.savedWorkIds);
    } else {
      // Local fallback
      try {
        const local = localStorage.getItem('pdh_saved_works');
        if (local) setSavedWorkIds(JSON.parse(local));
      } catch {}
    }

    if (userProfile?.recentlyViewedProjectIds) {
      setRecentViewIds(userProfile.recentlyViewedProjectIds);
    }
  }, [userProfile]);

  // Subscribe to Services (Public)
  useEffect(() => {
    try {
      const q = query(collection(db, 'services'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as ServiceItem);
          setServices(list);
        }
        setLoadingServices(false);
      }, (err) => {
        console.warn('Services snapshot error, using initial defaults:', err);
        setLoadingServices(false);
      });
      return () => unsub();
    } catch {
      setLoadingServices(false);
    }
  }, []);

  // Subscribe to Portfolio (Public)
  useEffect(() => {
    try {
      const q = query(collection(db, 'portfolio'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as PortfolioProject);
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setPortfolio(list);
        }
        setLoadingPortfolio(false);
      }, (err) => {
        console.warn('Portfolio snapshot error, using initial defaults:', err);
        setLoadingPortfolio(false);
      });
      return () => unsub();
    } catch {
      setLoadingPortfolio(false);
    }
  }, []);

  // Subscribe to Orders (Client gets their own, Admin gets all)
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setProjects([]);
      setLoadingOrders(false);
      setLoadingProjects(false);
      return;
    }

    setLoadingOrders(true);
    setLoadingProjects(true);

    try {
      const ordersRef = collection(db, 'orders');
      const q = isAdmin 
        ? query(ordersRef) 
        : query(ordersRef, where('clientId', '==', currentUser.uid));

      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const raw = d.data();
          return {
            ...raw,
            id: d.id,
            status: normalizeOrderStatus(raw.status),
          } as Order;
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
        setLoadingOrders(false);

        // Derive or map ClientProjects from orders
        const derivedProjects: ClientProject[] = list.map((order) => {
          const isComplete = order.status === 'delivered';
          const isInReview = order.status === 'first_preview' || order.status === 'revision';
          return {
            id: `proj-${order.id}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            clientId: order.clientId,
            clientName: order.clientName,
            title: order.title,
            serviceName: order.serviceName,
            status: isComplete ? 'completed' : isInReview ? 'in_review' : 'active',
            progress: order.progress,
            coverImage: order.deliverables?.[0]?.previewUrl || 
              (services.find((s) => s.id === order.serviceId)?.sampleImage) ||
              'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80',
            deliverables: order.deliverables || [],
            brief: order.description,
            milestones: (order.timeline || []).map((t) => ({
              title: t.label,
              date: t.date,
              completed: t.completed,
            })),
            conversationId: order.clientId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          };
        });
        setProjects(derivedProjects);
        setLoadingProjects(false);
      }, (err) => {
        console.warn('Orders snapshot error:', err);
        setLoadingOrders(false);
        setLoadingProjects(false);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Orders subscription failed:', err);
      setLoadingOrders(false);
      setLoadingProjects(false);
    }
  }, [currentUser?.uid, isAdmin, services]);

  // Subscribe to Conversations
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      return;
    }

    try {
      const convRef = collection(db, 'conversations');
      const q = isAdmin
        ? query(convRef)
        : query(convRef, where('clientId', '==', currentUser.uid));

      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as Conversation[];
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setConversations(list);

        // Auto-select first conversation if none selected
        if (!selectedConversationId && list.length > 0) {
          setSelectedConversationId(list[0].id);
        }
      }, (err) => {
        console.warn('Conversations snapshot error:', err);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Conversations subscription failed:', err);
    }
  }, [currentUser?.uid, isAdmin, selectedConversationId]);

  // Subscribe to Messages in Active Conversation
  useEffect(() => {
    if (!selectedConversationId) {
      setActiveConversationMessages([]);
      return;
    }

    try {
      const messagesRef = collection(db, 'conversations', selectedConversationId, 'messages');
      const q = query(messagesRef);

      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as ChatMessage[];
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setActiveConversationMessages(list);
      }, (err) => {
        console.warn('Messages snapshot error:', err);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Messages subscription failed:', err);
    }
  }, [selectedConversationId]);

  // Subscribe to Notifications
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    try {
      const notifRef = collection(db, 'notifications');
      const q = query(notifRef, where('userId', '==', currentUser.uid));

      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as NotificationItem[];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(list);
      }, (err) => {
        console.warn('Notifications snapshot error:', err);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Notifications subscription failed:', err);
    }
  }, [currentUser?.uid]);

  // Toggle Save / Wishlist Work
  const toggleSaveWork = async (projectId: string) => {
    const isSaved = savedWorkIds.includes(projectId);
    const updated = isSaved 
      ? savedWorkIds.filter((id) => id !== projectId) 
      : [...savedWorkIds, projectId];

    setSavedWorkIds(updated);

    try {
      localStorage.setItem('pdh_saved_works', JSON.stringify(updated));
    } catch {}

    if (currentUser && updateUserProfileData) {
      await updateUserProfileData({ savedWorkIds: updated });
    }
  };

  // Record Recently Viewed Project
  const recordRecentlyViewed = (projectId: string) => {
    const updated = [projectId, ...recentViewIds.filter((id) => id !== projectId)].slice(0, 6);
    setRecentViewIds(updated);

    if (currentUser && updateUserProfileData) {
      updateUserProfileData({ recentlyViewedProjectIds: updated }).catch(() => {});
    }
  };

  const recentlyViewedProjects = useMemo(() => {
    return recentViewIds
      .map((id) => portfolio.find((p) => p.id === id))
      .filter(Boolean) as PortfolioProject[];
  }, [recentViewIds, portfolio]);

  // Create an Order (Commerce Flow Style)
  const createOrder = async (orderData: Partial<Order>): Promise<string> => {
    if (!currentUser) throw new Error('Must be authenticated to submit an order request.');

    const orderNumber = `PDH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const initialTimeline: OrderTimelineEvent[] = ORDER_STATUS_STEPS.map((step) => ({
      status: step.status,
      label: step.label,
      date: step.status === 'order_placed' ? now : '',
      completed: step.status === 'order_placed',
      description: step.description,
    }));

    const newOrder: Order = {
      id: '',
      orderNumber,
      clientId: currentUser.uid,
      clientName: userProfile?.displayName || currentUser.displayName || 'Client Partner',
      clientEmail: currentUser.email || '',
      clientCompany: userProfile?.company || userProfile?.frequentlyUsedInfo?.defaultBrandName || '',
      serviceId: orderData.serviceId || 'poster-design',
      serviceName: orderData.serviceName || 'Poster Design',
      title: orderData.title || 'Untitled Commission',
      description: orderData.description || '',
      referenceLinks: orderData.referenceLinks || [],
      status: 'order_placed',
      progress: 15,
      priority: orderData.priority || 'standard',
      budgetRange: orderData.budgetRange || '$1,000 – $2,500',
      deadline: orderData.deadline || '2 – 3 Weeks',
      paymentStatus: 'invoiced',
      invoiceAmount: orderData.budgetRange?.split('–')[0]?.trim() || '$1,200',
      deliverables: [],
      notes: orderData.notes || '',
      timeline: initialTimeline,
      deliveryInformation: 'High-res master assets, CMYK vector exports & digital guidelines.',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    await updateDoc(docRef, { id: docRef.id });

    // Link or create conversation for this client project
    await getOrCreateConversationForClient(
      currentUser.uid,
      newOrder.clientName,
      newOrder.clientEmail,
      docRef.id,
      newOrder.title
    );

    // Auto-create client notification
    await addDoc(collection(db, 'notifications'), {
      userId: currentUser.uid,
      title: `Order ${orderNumber} Placed`,
      message: `Your commission for "${newOrder.title}" has been registered in the Pixel Design House queue.`,
      type: 'order_placed',
      link: `/orders`,
      read: false,
      createdAt: now,
    });

    return docRef.id;
  };

  // Update Order Status (Phase advancement) with rich notifications
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, progress?: number, notes?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const normalized = normalizeOrderStatus(newStatus);
    const now = new Date().toISOString();
    const stepInfo = ORDER_STATUS_STEPS.find((s) => s.status === normalized);
    const newProgress = progress !== undefined ? progress : (stepInfo?.defaultProgress || order.progress);

    // Update timeline
    const updatedTimeline = ORDER_STATUS_STEPS.map((step) => {
      const currentIndex = ORDER_STATUS_STEPS.findIndex((s) => s.status === normalized);
      const stepIndex = ORDER_STATUS_STEPS.findIndex((s) => s.status === step.status);
      const isCompleted = stepIndex <= currentIndex;

      const existingStep = order.timeline?.find((t) => t.status === step.status);

      return {
        status: step.status,
        label: step.label,
        completed: isCompleted,
        date: isCompleted ? (existingStep?.date || now) : '',
        description: step.description,
      };
    });

    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: normalized,
      progress: newProgress,
      timeline: updatedTimeline,
      notes: notes !== undefined ? notes : order.notes,
      updatedAt: now,
    });

    // Notify client of status change
    let notifType: NotificationItem['type'] = 'status_change';
    if (normalized === 'first_preview') notifType = 'preview_ready';
    if (normalized === 'revision') notifType = 'revision_update';
    if (normalized === 'delivered') notifType = 'delivered';

    await addDoc(collection(db, 'notifications'), {
      userId: order.clientId,
      title: `Milestone: ${stepInfo?.label || normalized}`,
      message: `Your project "${order.title}" has reached ${stepInfo?.label}. ${notes ? `Note: "${notes}"` : ''}`,
      type: notifType,
      link: `/orders`,
      read: false,
      createdAt: now,
    });
  };

  // Update arbitrary order details
  const updateOrderDetails = async (orderId: string, updates: Partial<Order>) => {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  // Add Deliverable File to Order & Notify Client
  const addDeliverableToOrder = async (orderId: string, file: DeliverableFile) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedDeliverables = [...(order.deliverables || []), file];
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      deliverables: updatedDeliverables,
      updatedAt: new Date().toISOString(),
    });

    // Notify client
    await addDoc(collection(db, 'notifications'), {
      userId: order.clientId,
      title: `New Deliverable Available`,
      message: `"${file.name}" was uploaded to your project "${order.title}". Ready for download.`,
      type: 'preview_ready',
      link: `/orders`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  };

  // Get or Create Conversation for Client
  const getOrCreateConversationForClient = async (
    clientId: string,
    clientName: string,
    clientEmail: string,
    orderId?: string,
    orderTitle?: string
  ): Promise<string> => {
    const existing = conversations.find((c) => c.clientId === clientId);
    if (existing) {
      if (orderId && (!existing.orderId || existing.orderId !== orderId)) {
        await updateDoc(doc(db, 'conversations', existing.id), {
          orderId,
          orderTitle: orderTitle || existing.orderTitle,
          updatedAt: new Date().toISOString(),
        });
      }
      setSelectedConversationId(existing.id);
      return existing.id;
    }

    const now = new Date().toISOString();
    const newConv: Omit<Conversation, 'id'> = {
      clientId,
      clientName,
      clientEmail,
      orderId,
      orderTitle,
      lastMessage: 'Channel opened with Pixel Design House creative team.',
      lastMessageSender: 'Pixel Design House',
      lastMessageTime: now,
      unreadByAdmin: 0,
      unreadByClient: 0,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'conversations'), newConv);
    await updateDoc(docRef, { id: docRef.id });

    // Send studio welcoming message
    const welcomeMsg: Omit<ChatMessage, 'id'> = {
      conversationId: docRef.id,
      senderId: 'studio-director',
      senderName: 'Pixel Design House (Creative Team)',
      senderRole: 'admin',
      text: `Welcome to Pixel Design House! We are delighted to partner on your creative vision. Feel free to share your brief, references, deadlines, and questions right here.`,
      orderId,
      createdAt: now,
      read: true,
    };

    await addDoc(collection(db, 'conversations', docRef.id, 'messages'), welcomeMsg);
    setSelectedConversationId(docRef.id);
    return docRef.id;
  };

  // Send a Chat Message
  const sendMessage = async (conversationId: string, text: string, orderId?: string) => {
    if (!currentUser || !text.trim()) return;

    const conv = conversations.find((c) => c.id === conversationId);
    const now = new Date().toISOString();

    const senderRole = isAdmin ? 'admin' : 'client';
    const senderName = userProfile?.displayName || currentUser.displayName || (isAdmin ? 'Pixel Design House' : 'Client');

    const newMsg: Omit<ChatMessage, 'id'> = {
      conversationId,
      senderId: currentUser.uid,
      senderName,
      senderRole,
      text: text.trim(),
      orderId: orderId || conv?.orderId,
      createdAt: now,
      read: false,
    };

    await addDoc(collection(db, 'conversations', conversationId, 'messages'), newMsg);

    // Update conversation metadata
    const convRef = doc(db, 'conversations', conversationId);
    await updateDoc(convRef, {
      lastMessage: text.trim(),
      lastMessageSender: senderName,
      lastMessageTime: now,
      updatedAt: now,
      unreadByAdmin: isAdmin ? 0 : (conv ? (conv.unreadByAdmin || 0) + 1 : 1),
      unreadByClient: isAdmin ? (conv ? (conv.unreadByClient || 0) + 1 : 1) : 0,
    });

    // Notify recipient
    if (conv) {
      const recipientId = isAdmin ? conv.clientId : 'admin';
      if (recipientId !== 'admin') {
        await addDoc(collection(db, 'notifications'), {
          userId: recipientId,
          title: `New Studio Message`,
          message: `${senderName}: "${text.trim().slice(0, 60)}..."`,
          type: 'message',
          link: `/chat`,
          read: false,
          createdAt: now,
        });
      }
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    const convRef = doc(db, 'conversations', conversationId);
    if (isAdmin) {
      await updateDoc(convRef, { unreadByAdmin: 0 });
    } else {
      await updateDoc(convRef, { unreadByClient: 0 });
    }
  };

  const addPortfolioProject = async (project: PortfolioProject) => {
    const ref = doc(db, 'portfolio', project.id || project.slug);
    await setDoc(ref, project);
  };

  const updatePortfolioProject = async (id: string, updates: Partial<PortfolioProject>) => {
    const ref = doc(db, 'portfolio', id);
    await updateDoc(ref, updates);
  };

  const deletePortfolioProject = async (id: string) => {
    const ref = doc(db, 'portfolio', id);
    await deleteDoc(ref);
  };

  const updateServiceItem = async (id: string, updates: Partial<ServiceItem>) => {
    const ref = doc(db, 'services', id);
    await updateDoc(ref, updates);
  };

  const markNotificationAsRead = async (id: string) => {
    const ref = doc(db, 'notifications', id);
    await updateDoc(ref, { read: true });
  };

  const markAllNotificationsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const notif of unread) {
      await updateDoc(doc(db, 'notifications', notif.id), { read: true });
    }
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        projects,
        services,
        portfolio,
        conversations,
        activeConversationMessages,
        notifications,
        savedWorkIds,
        recentlyViewedProjects,
        selectedConversationId,
        loadingOrders,
        loadingProjects,
        loadingServices,
        loadingPortfolio,
        setSelectedConversationId,
        createOrder,
        updateOrderStatus,
        updateOrderDetails,
        addDeliverableToOrder,
        sendMessage,
        getOrCreateConversationForClient,
        markConversationAsRead,
        toggleSaveWork,
        recordRecentlyViewed,
        addPortfolioProject,
        updatePortfolioProject,
        deletePortfolioProject,
        updateServiceItem,
        markNotificationAsRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

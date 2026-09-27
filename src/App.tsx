import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AuthModal } from './components/auth/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Public pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AiCreativeStudioPage } from './pages/AiCreativeStudioPage';

// Client pages
import { ClientDashboard } from './pages/client/ClientDashboard';
import { MyOrdersPage } from './pages/client/MyOrdersPage';
import { MyProjectsPage } from './pages/client/MyProjectsPage';
import { SavedPage } from './pages/client/SavedPage';
import { NotificationsPage } from './pages/client/NotificationsPage';
import { ChatPage } from './pages/client/ChatPage';
import { ProfilePage } from './pages/client/ProfilePage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const { currentUser, isAdmin } = useAuth();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Keyboard shortcut listener for Global Search (Cmd+K, Ctrl+K, or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, extraParam?: string) => {
    if (view === 'portfolio_detail' && extraParam) {
      setSelectedProjectId(extraParam);
    } else if (view === 'contact' && extraParam) {
      setSelectedServiceId(extraParam);
    } else if (view === 'client_orders' && extraParam) {
      setSelectedOrderId(extraParam);
    } else if (view === 'client_projects' && extraParam) {
      setSelectedProjectId(extraParam);
    }

    // Protection for client/admin routes if not logged in
    const protectedViews = [
      'client_dashboard', 
      'client_orders', 
      'client_projects', 
      'saved', 
      'notifications', 
      'chat', 
      'profile', 
      'admin_dashboard'
    ];

    if (protectedViews.includes(view) && !currentUser) {
      setAuthModalOpen(true);
      return;
    }

    // Protection for admin route
    if (view === 'admin_dashboard' && currentUser && !isAdmin) {
      setCurrentView('client_dashboard');
      return;
    }

    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-slate-100 selection:bg-cyan-500/25 selection:text-white pb-16 lg:pb-0">
      
      {/* Sticky Studio Header with Search & Account Menu */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'services' && (
          <ServicesPage onNavigate={handleNavigate} />
        )}

        {currentView === 'portfolio' && (
          <PortfolioPage onNavigate={handleNavigate} />
        )}

        {currentView === 'portfolio_detail' && (
          <ProjectDetailPage
            projectId={selectedProjectId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactPage
            initialServiceId={selectedServiceId}
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* AI Creative Studio Lab (Image Generation/Editing & Veo Video Animation) */}
        {currentView === 'ai_studio' && (
          <AiCreativeStudioPage
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* Client Routes */}
        {currentView === 'client_dashboard' && (
          <ClientDashboard 
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
        )}

        {currentView === 'client_orders' && (
          <MyOrdersPage
            initialOrderId={selectedOrderId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'client_projects' && (
          <MyProjectsPage
            initialProjectId={selectedProjectId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'saved' && (
          <SavedPage onNavigate={handleNavigate} />
        )}

        {currentView === 'notifications' && (
          <NotificationsPage onNavigate={handleNavigate} />
        )}

        {currentView === 'chat' && (
          <ChatPage onNavigate={handleNavigate} />
        )}

        {currentView === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {/* Admin Route */}
        {currentView === 'admin_dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
      </main>

      {/* Studio Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar (Modern Commerce App Feel) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Global Search Modal (⌘K / /) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (currentView === 'home') {
            setCurrentView(isAdmin ? 'admin_dashboard' : 'client_dashboard');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

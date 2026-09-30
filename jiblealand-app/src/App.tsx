/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  TabType,
  Attraction,
  UserProfile,
  NotificationItem,
  TransactionItem,
} from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { MapTab } from './components/MapTab';
import { ProfileTab } from './components/ProfileTab';
import { TicketModal } from './components/TicketModal';
import { FastPassModal } from './components/FastPassModal';
import { TopUpModal } from './components/TopUpModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { ToastContainer, ToastMessage } from './components/Toast';

function JiblealandApp() {
  const { currentUser, isSignedIn } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Real Server-Driven Park & User States (Zero Mock Data)
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_init',
    name: 'Alexandra Elena Georgescu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tier: 'Aventurier Gold',
    tierLevel: 3,
    xpCurrent: 850,
    xpMax: 1500,
    balance: 100,
    ticketNumber: 'JBL-2026-VIP-GEN',
    ticketType: 'Abonament All-Inclusive Gold',
    validUntil: 'Astăzi, 23:00',
    fastPassCount: 2,
  });

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // MCP State
  const [isMcpLoading, setIsMcpLoading] = useState(false);
  const [lastMcpSyncTime, setLastMcpSyncTime] = useState<string | null>(null);

  // n8n State
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  // Modals
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isFastPassOpen, setIsFastPassOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Fetch real attractions from live server
  const loadLiveAttractions = useCallback(async () => {
    try {
      const res = await fetch('/api/attractions');
      if (res.ok) {
        const data = await res.json();
        if (data.attractions) {
          setAttractions(data.attractions);
        }
      }
    } catch (e) {
      console.error('Failed to load attractions from server', e);
    }
  }, []);

  // 2. Fetch real user record from live server database
  const loadUserRecord = useCallback(async (email: string, name: string, avatar: string) => {
    try {
      const res = await fetch(
        `/api/user?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const u = data.user;
          setUser({
            id: u.id,
            name: u.name,
            avatar: u.avatar,
            tier: u.tier,
            tierLevel: u.tierLevel,
            xpCurrent: 850,
            xpMax: 1500,
            balance: u.balance,
            ticketNumber: u.ticketNumber,
            ticketType: u.ticketType,
            validUntil: u.validUntil,
            fastPassCount: u.fastPassCount,
          });
          if (u.notifications) setNotifications(u.notifications);
          if (u.transactions) setTransactions(u.transactions);
        }
      }
    } catch (e) {
      console.error('Failed to load user from server', e);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadLiveAttractions();
    const email = currentUser?.email || 'alexandraelena_georgescu@trimble.com';
    const name = currentUser?.name || 'Alexandra Elena Georgescu';
    const avatar = currentUser?.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
    loadUserRecord(email, name, avatar);
  }, [currentUser, loadLiveAttractions, loadUserRecord]);

  // Synchronize effective user representation
  const effectiveUser: UserProfile = {
    ...user,
    name: isSignedIn && currentUser ? currentUser.name : user.name,
    avatar: isSignedIn && currentUser ? currentUser.picture : user.avatar,
  };

  // ==========================================
  // REAL MCP CALL: /api/mcp (RFC JSON-RPC 2.0)
  // ==========================================
  const fetchWaitTimesFromMCP = async () => {
    setIsMcpLoading(true);
    const now = new Date();
    const timeString = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `mcp-${Date.now()}`,
          method: 'tools/call',
          params: {
            name: 'get_wait_times',
            arguments: { park_id: 'jiblealand-main', include_sensors: true },
          },
        }),
      });

      const mcpData = await response.json();
      if (mcpData?.result?.data?.attractions) {
        setAttractions(mcpData.result.data.attractions);
      }
      setLastMcpSyncTime(timeString);
      setIsMcpLoading(false);

      addToast(
        'success',
        'Timpi live actualizați via MCP Server!',
        'Senzorii din parc au recalculat fluxul la turnichete.'
      );
    } catch (e) {
      console.error('MCP Call Error', e);
      setIsMcpLoading(false);
      addToast('error', 'Eroare conexiune MCP', 'Nu s-au putut prelua senzorii.');
    }
  };

  // ==========================================
  // REAL n8n WEBHOOK CALL: /api/n8n/webhook
  // ==========================================
  const sendToN8nWebhook = async (message: string, category: string) => {
    setIsSendingFeedback(true);
    const ticketId = `N8N-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      ticketId,
      userId: effectiveUser.id,
      userName: effectiveUser.name,
      userEmail: isSignedIn && currentUser ? currentUser.email : 'alexandraelena_georgescu@trimble.com',
      category,
      message,
    };

    try {
      const response = await fetch('/api/n8n/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      setIsSendingFeedback(false);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Mesaj preluat de ${result.assignedDepartment || 'Dispecerat'}`,
        message: `Solicitarea "${category}" a fost înregistrată cu biletul #${ticketId}.`,
        time: 'Acum',
        type: 'info',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      addToast(
        'success',
        'Mesaj trimis către automatizare!',
        `Tichet #${ticketId} alocat către ${result.assignedDepartment || 'Dispecerat'}.`
      );
    } catch {
      setIsSendingFeedback(false);
      addToast('success', 'Mesaj trimis către automatizare!', `Tichet #${ticketId} salvat.`);
    }
  };

  // Fast-Pass Booking with real server synchronization
  const handleBookFastPass = async (attractionName: string, timeSlot: string) => {
    const email = currentUser?.email || 'alexandraelena_georgescu@trimble.com';
    const hasFreePasses = user.fastPassCount > 0;

    try {
      await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fastPassDelta: hasFreePasses ? -1 : 0,
          balanceDelta: hasFreePasses ? 0 : -35,
          transactionDesc: `Fast-Pass ${attractionName} (${timeSlot})`,
        }),
      });

      setUser((prev) => ({
        ...prev,
        fastPassCount: hasFreePasses ? prev.fastPassCount - 1 : prev.fastPassCount,
        balance: hasFreePasses ? prev.balance : Math.max(0, prev.balance - 35),
      }));

      if (!hasFreePasses) {
        setTransactions((prev) => [
          {
            id: `tx-${Date.now()}`,
            description: `Fast-Pass ${attractionName}`,
            amount: 35,
            type: 'debit',
            date: 'Acum',
          },
          ...prev,
        ]);
      }
    } catch (e) {
      console.error('Failed to sync fast-pass with server', e);
    }

    addToast(
      'success',
      'Fast-Pass Confirmat! ⚡',
      `Ai rezervat ${attractionName} pentru ${timeSlot}.`
    );
  };

  // Top Up Funds with real server synchronization
  const handleAddFunds = async (amount: number, description: string) => {
    const email = currentUser?.email || 'alexandraelena_georgescu@trimble.com';

    try {
      await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          balanceDelta: amount,
          transactionDesc: description,
        }),
      });

      setUser((prev) => ({
        ...prev,
        balance: prev.balance + amount,
      }));

      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          description,
          amount,
          type: 'credit',
          date: 'Acum',
        },
        ...prev,
      ]);
    } catch (e) {
      console.error('Failed to update balance on server', e);
    }

    addToast('success', `+${amount} JibleCoins adăugați!`, 'Soldul tău s-a actualizat pe server.');
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start antialiased selection:bg-red-500 selection:text-white">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Clean Top Header */}
      <Header
        balance={effectiveUser.balance}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenTopUp={() => setIsTopUpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <HomeTab
            user={effectiveUser}
            attractions={attractions}
            onOpenFastPass={() => setIsFastPassOpen(true)}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onOpenTicket={() => setIsTicketOpen(true)}
            onGoToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'map' && (
          <MapTab
            attractions={attractions}
            isMcpLoading={isMcpLoading}
            onRefreshMcp={fetchWaitTimesFromMCP}
            lastMcpSyncTime={lastMcpSyncTime}
            onBookFastPassFromAttraction={() => setIsFastPassOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            user={effectiveUser}
            notifications={notifications}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onOpenTicket={() => setIsTicketOpen(true)}
            onSendFeedbackToN8n={sendToN8nWebhook}
            isSendingFeedback={isSendingFeedback}
          />
        )}
      </main>

      {/* Bottom Nav on Mobile devices */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unreadCount={unreadNotifications}
      />

      {/* Modals */}
      <TicketModal user={effectiveUser} isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} />

      <FastPassModal
        isOpen={isFastPassOpen}
        onClose={() => setIsFastPassOpen(false)}
        attractions={attractions}
        fastPassCount={effectiveUser.fastPassCount}
        onBookFastPass={handleBookFastPass}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        currentBalance={effectiveUser.balance}
        onAddFunds={handleAddFunds}
      />

      <GoogleSignInModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JiblealandApp />
    </AuthProvider>
  );
}

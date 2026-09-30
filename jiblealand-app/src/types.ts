export type TabType = 'home' | 'map' | 'profile';

export interface Attraction {
  id: string;
  name: string;
  category: 'Rollercoaster' | 'Familie' | 'Acvatic' | 'Adrenalină' | 'Copii';
  zone: string;
  waitTimeMinutes: number; // 0 if closed or maintenance
  status: 'open' | 'closed' | 'maintenance' | 'fast_pass_available';
  heightLimitCm?: number;
  intensity: 'Ușor' | 'Moderat' | 'Extrem';
  description: string;
  thumbnail: string;
  fastPassAvailable: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  tierLevel: number;
  xpCurrent: number;
  xpMax: number;
  balance: number; // JibleCoins
  ticketNumber: string;
  ticketType: string;
  validUntil: string;
  fastPassCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'reward';
  read: boolean;
}

export interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
}

export interface McpCallLog {
  id: string;
  timestamp: string;
  tool: string;
  server: string;
  arguments: Record<string, unknown>;
  durationMs: number;
  responseCount: number;
  status: 'success' | 'pending';
}

export interface N8nWebhookLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'POST';
  payload: {
    ticketId: string;
    userId: string;
    userName: string;
    category: string;
    message: string;
    location: string;
    userTier: string;
  };
  status: number;
}

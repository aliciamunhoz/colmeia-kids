import type {
  Activity,
  Announcement,
  AppNotification,
  Attendance,
  Child,
  Conversation,
  DailyRecord,
  Daycare,
  DevelopmentReport,
  ID,
  Invoice,
  ISODate,
  Message,
  Milestone,
  Payment,
  PortfolioItem,
  Room,
  Time,
  User,
} from '@/types/models';
import { seedData } from './seed';

export type AppData = {
  daycares: Daycare[];
  rooms: Room[];
  users: User[];
  children: Child[];
  attendance: Attendance[];
  records: DailyRecord[];
  activities: Activity[];
  development: DevelopmentReport[];
  milestones: Milestone[];
  portfolio: PortfolioItem[];
  conversations: Conversation[];
  messages: Message[];
  announcements: Announcement[];
  notifications: AppNotification[];
  invoices: Invoice[];
};

type Presence = { time: Time; byName: string; method: 'qr' | 'manual' };

export type DataAction =
  | { type: 'HYDRATE'; data: AppData } // carregar o que estava guardado
  | { type: 'RESET' } // voltar aos dados iniciais
  | { type: 'CHECK_IN'; id: ID; childId: ID; date: ISODate; presence: Presence }
  | { type: 'CHECK_OUT'; childId: ID; date: ISODate; presence: Presence }
  | { type: 'ADD_RECORD'; record: DailyRecord }
  | { type: 'ADD_ACTIVITY'; activity: Activity }
  | { type: 'ADD_PORTFOLIO_ITEM'; item: PortfolioItem }
  | { type: 'SEND_MESSAGE'; message: Message }
  | { type: 'MARK_CONVERSATION_READ'; conversationId: ID; userId: ID }
  | { type: 'ADD_ANNOUNCEMENT'; announcement: Announcement }
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: ID }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ'; userId: ID }
  | { type: 'ADD_NOTIFICATIONS'; notifications: AppNotification[] }
  | { type: 'START_CONVERSATION'; conversation: Conversation }
  | { type: 'UPSERT_DEVELOPMENT'; report: DevelopmentReport }
  | { type: 'UPSERT_ROOM'; room: Room }
  | { type: 'REMOVE_ROOM'; roomId: ID }
  | { type: 'UPSERT_DAYCARE'; daycare: Daycare }
  | { type: 'UPSERT_INVOICE'; invoice: Invoice }
  | { type: 'UPSERT_ATTENDANCE'; attendance: Attendance }
  | { type: 'UPSERT_USER'; user: User }
  | { type: 'REMOVE_USER'; userId: ID }
  | { type: 'UPSERT_CHILD'; child: Child }
  | { type: 'CREATE_INVOICE'; invoice: Invoice }
  | { type: 'RECORD_PAYMENT'; invoiceId: ID; payment: Payment };

function upsert<T extends { id: ID }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id)
    ? list.map((x) => (x.id === item.id ? item : x))
    : [...list, item];
}

export function dataReducer(state: AppData, action: DataAction): AppData {
  switch (action.type) {
    case 'HYDRATE':
      return action.data;

    case 'RESET':
      return seedData;

    case 'CHECK_IN': {
      const existing = state.attendance.find((a) => a.childId === action.childId && a.date === action.date);
      if (existing?.checkIn) return state;
      const entry: Attendance = existing
        ? { ...existing, checkIn: action.presence }
        : { id: action.id, childId: action.childId, date: action.date, checkIn: action.presence };
      return { ...state, attendance: upsert(state.attendance, entry) };
    }

    case 'CHECK_OUT': {
      const existing = state.attendance.find((a) => a.childId === action.childId && a.date === action.date);
      if (!existing?.checkIn || existing.checkOut) return state;
      return { ...state, attendance: upsert(state.attendance, { ...existing, checkOut: action.presence }) };
    }

    case 'ADD_RECORD':
      return { ...state, records: [...state.records, action.record] };

    case 'ADD_ACTIVITY':
      return { ...state, activities: [...state.activities, action.activity] };

    case 'ADD_PORTFOLIO_ITEM':
      return { ...state, portfolio: [...state.portfolio, action.item] };

    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };

    case 'MARK_CONVERSATION_READ':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.conversationId === action.conversationId && !m.readBy.includes(action.userId)
            ? { ...m, readBy: [...m.readBy, action.userId] }
            : m,
        ),
      };

    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [action.announcement, ...state.announcements] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n,
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.userId === action.userId && !n.read ? { ...n, read: true } : n,
        ),
      };

    case 'ADD_NOTIFICATIONS':
      return { ...state, notifications: [...action.notifications, ...state.notifications] };

    case 'START_CONVERSATION':
      return state.conversations.some((c) => c.id === action.conversation.id)
        ? state
        : { ...state, conversations: [...state.conversations, action.conversation] };

    case 'UPSERT_DEVELOPMENT':
      return { ...state, development: upsert(state.development, action.report) };

    case 'REMOVE_ROOM': {
      const id = action.roomId;
      const removedConversations = new Set(
        state.conversations.filter((c) => c.type === 'room' && c.roomId === id).map((c) => c.id),
      );
      return {
        ...state,
        rooms: state.rooms.filter((r) => r.id !== id),
        activities: state.activities.filter((a) => a.roomId !== id),
        announcements: state.announcements.filter((a) => a.roomId !== id),
        conversations: state.conversations.filter((c) => !removedConversations.has(c.id)),
        messages: state.messages.filter((m) => !removedConversations.has(m.conversationId)),
      };
    }

    case 'UPSERT_ROOM':
      return { ...state, rooms: upsert(state.rooms, action.room) };

    case 'UPSERT_DAYCARE':
      return { ...state, daycares: upsert(state.daycares, action.daycare) };

    case 'UPSERT_INVOICE':
      return { ...state, invoices: upsert(state.invoices, action.invoice) };

    case 'UPSERT_ATTENDANCE':
      return { ...state, attendance: upsert(state.attendance, action.attendance) };

    case 'UPSERT_USER':
      return { ...state, users: upsert(state.users, action.user) };

    case 'REMOVE_USER': {
      const id = action.userId;
      const removedConversations = new Set(
        state.conversations.filter((c) => c.type === 'direct' && c.participantIds.includes(id)).map((c) => c.id),
      );
      return {
        ...state,
        users: state.users.filter((u) => u.id !== id),
        children: state.children.map((c) =>
          c.guardianIds.includes(id) ? { ...c, guardianIds: c.guardianIds.filter((g) => g !== id) } : c,
        ),
        rooms: state.rooms.map((r) =>
          r.educatorIds.includes(id) ? { ...r, educatorIds: r.educatorIds.filter((e) => e !== id) } : r,
        ),
        conversations: state.conversations
          .filter((c) => !removedConversations.has(c.id))
          .map((c) => (c.participantIds.includes(id) ? { ...c, participantIds: c.participantIds.filter((p) => p !== id) } : c)),
        messages: state.messages.filter((m) => !removedConversations.has(m.conversationId)),
        notifications: state.notifications.filter((n) => n.userId !== id),
      };
    }

    case 'UPSERT_CHILD':
      return { ...state, children: upsert(state.children, action.child) };

    case 'CREATE_INVOICE':
      return { ...state, invoices: [...state.invoices, action.invoice] };

    case 'RECORD_PAYMENT':
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.invoiceId ? { ...inv, payments: [...inv.payments, action.payment] } : inv,
        ),
      };

    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
}

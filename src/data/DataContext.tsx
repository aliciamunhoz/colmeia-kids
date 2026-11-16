import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  Activity,
  Announcement,
  Attendance,
  Child,
  Daycare,
  Room,
  DailyRecord,
  DevelopmentReport,
  ID,
  ISODate,
  NotificationKind,
  Invoice,
  PaymentMethod,
  PortfolioItem,
  User,
} from '@/types/models';
import { dataReducer, type AppData } from './dataReducer';
import { seedData } from './seed';
import { createId, nowDateTime, nowTime, TODAY } from './utils';

// Mudar a versão quando a forma dos dados mudar: os dados antigos são ignorados
// e a app recomeça com o seed (evita erros com JSON guardado num formato velho).
// v2: etapa 6.1 (capas, milestones, tipos de notificação…)
// v3: etapa 6.2 (níveis de avaliação, humor, autorizações de recolha…)
// v4: etapa 6.3 (preços, itens de fatura, cores das salas, faltas…)
const STORAGE_KEY = 'colmeia-kids:data:v4';

// Omit "distributivo": aplica o Omit a CADA membro da união.
// (Omit<DailyRecord, 'id'> normal juntava tudo e perdia a ligação type ↔ campos.)
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
// date e time são opcionais: por omissão usa-se "hoje" e a hora atual
// (o incidente permite escolher outra data/hora, como no Figma).
export type NewRecord = DistributiveOmit<DailyRecord, 'id' | 'date' | 'time'> & { date?: ISODate; time?: string };

// Funções que os ecrãs chamam. Criam ids/horas e despacham a ação para o reducer.
function createActions(dispatch: React.Dispatch<Parameters<typeof dataReducer>[1]>) {
  return {
    checkIn: (childId: ID, byName: string, method: 'qr' | 'manual' = 'manual') =>
      dispatch({ type: 'CHECK_IN', id: createId('att'), childId, date: TODAY, presence: { time: nowTime(), byName, method } }),

    checkOut: (childId: ID, byName: string, method: 'qr' | 'manual' = 'manual') =>
      dispatch({ type: 'CHECK_OUT', childId, date: TODAY, presence: { time: nowTime(), byName, method } }),

    addRecord: (record: NewRecord) =>
      dispatch({
        type: 'ADD_RECORD',
        record: { ...record, id: createId('rec'), date: record.date ?? TODAY, time: record.time ?? nowTime() } as DailyRecord,
      }),

    // Uma notificação igual para vários utilizadores (ex.: os encarregados de uma criança).
    notify: (userIds: ID[], kind: NotificationKind, title: string, body: string) =>
      dispatch({
        type: 'ADD_NOTIFICATIONS',
        notifications: userIds.map((userId) => ({ id: createId('not'), userId, kind, title, body, date: nowDateTime(), read: false })),
      }),

    // Abre (ou cria) a conversa direta entre duas pessoas e devolve o id.
    // O id é "determinístico" (sempre o mesmo para o mesmo par), por isso não há duplicados.
    startConversation: (userA: ID, userB: ID, title: string, roomId?: ID) => {
      const id = `conv_${[userA, userB].sort().join('_')}`;
      dispatch({ type: 'START_CONVERSATION', conversation: { id, type: 'direct', title, participantIds: [userA, userB], roomId } });
      return id;
    },

    saveAssessment: (report: Omit<DevelopmentReport, 'id' | 'date'> & { id?: ID }) =>
      dispatch({ type: 'UPSERT_DEVELOPMENT', report: { ...report, id: report.id ?? createId('dev'), date: TODAY } }),

    addActivity: (activity: Omit<Activity, 'id'>) =>
      dispatch({ type: 'ADD_ACTIVITY', activity: { ...activity, id: createId('act') } }),

    addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'date'>) =>
      dispatch({ type: 'ADD_PORTFOLIO_ITEM', item: { ...item, id: createId('pf'), date: TODAY } }),

    sendMessage: (conversationId: ID, senderId: ID, text: string) =>
      dispatch({
        type: 'SEND_MESSAGE',
        message: { id: createId('msg'), conversationId, senderId, text: text.trim(), sentAt: nowDateTime(), readBy: [senderId] },
      }),

    markConversationRead: (conversationId: ID, userId: ID) =>
      dispatch({ type: 'MARK_CONVERSATION_READ', conversationId, userId }),

    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) =>
      dispatch({ type: 'ADD_ANNOUNCEMENT', announcement: { ...announcement, id: createId('ann'), date: TODAY } }),

    markNotificationRead: (notificationId: ID) => dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId }),

    markAllNotificationsRead: (userId: ID) => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', userId }),

    // "save" = criar (sem id) ou editar (com id). Devolvem o id, para o ecrã
    // poder navegar logo a seguir (ex.: para o ecrã de confirmação).
    saveUser: (user: Omit<User, 'id'> & { id?: ID }) => {
      const id = user.id ?? createId('u');
      dispatch({ type: 'UPSERT_USER', user: { ...user, id } });
      return id;
    },

    saveChild: (child: Omit<Child, 'id'> & { id?: ID }) => {
      const id = child.id ?? createId('c');
      dispatch({ type: 'UPSERT_CHILD', child: { ...child, id } });
      return id;
    },

    saveRoom: (room: Omit<Room, 'id'> & { id?: ID }) => {
      const id = room.id ?? createId('r');
      dispatch({ type: 'UPSERT_ROOM', room: { ...room, id } });
      return id;
    },

    saveDaycare: (daycare: Daycare) => dispatch({ type: 'UPSERT_DAYCARE', daycare }),

    saveAttendance: (attendance: Omit<Attendance, 'id'> & { id?: ID }) =>
      dispatch({ type: 'UPSERT_ATTENDANCE', attendance: { ...attendance, id: attendance.id ?? createId('att') } }),

    createInvoice: (invoice: Omit<Invoice, 'id' | 'payments'>) => {
      const id = createId('inv');
      dispatch({ type: 'CREATE_INVOICE', invoice: { ...invoice, id, payments: [] } });
      return id;
    },

    updateInvoice: (invoice: Invoice) => dispatch({ type: 'UPSERT_INVOICE', invoice }),

    recordPayment: (invoiceId: ID, amount: number, method: PaymentMethod, extra: { date?: ISODate; reference?: string; notes?: string } = {}) =>
      dispatch({ type: 'RECORD_PAYMENT', invoiceId, payment: { date: extra.date ?? TODAY, amount, method, reference: extra.reference, notes: extra.notes } }),

    resetDemo: () => dispatch({ type: 'RESET' }),
  };
}

type DataContextValue = { data: AppData; actions: ReturnType<typeof createActions> };

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(dataReducer, seedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) dispatch({ type: 'HYDRATE', data: JSON.parse(json) as AppData });
      })
      .catch((error) => console.warn('Não foi possível ler os dados guardados', error))
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch((error) =>
      console.warn('Não foi possível guardar os dados', error),
    );
  }, [data, hydrated]);

  const actions = useMemo(() => createActions(dispatch), []);
  const value = useMemo(() => ({ data, actions }), [data, actions]);

  if (!hydrated) return null;

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData tem de ser usado dentro de <DataProvider>');
  return ctx;
}

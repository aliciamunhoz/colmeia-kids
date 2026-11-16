import type {
  AttendanceStatus,
  Child,
  DailyRecord,
  ID,
  Invoice,
  InvoiceStatus,
  ISODate,
  Mood,
} from '@/types/models';
import type { AppData } from './dataReducer';
import { minutesBetween, TODAY } from './utils';

const byTime = <T extends { time: string }>(a: T, b: T) => a.time.localeCompare(b.time);

// ---------- Pessoas ----------

export const getUser = (d: AppData, id: ID) => d.users.find((u) => u.id === id);
export const getChild = (d: AppData, id: ID) => d.children.find((c) => c.id === id);
export const getRoom = (d: AppData, id: ID) => d.rooms.find((r) => r.id === id);
export const getDaycare = (d: AppData, id: ID) => d.daycares.find((dc) => dc.id === id);

export const getChildrenForParent = (d: AppData, parentId: ID) =>
  d.children.filter((c) => c.guardianIds.includes(parentId));

export const getRoomsForEducator = (d: AppData, educatorId: ID) =>
  d.rooms.filter((r) => r.educatorIds.includes(educatorId));

export const getRoomsForDaycare = (d: AppData, daycareId: ID) =>
  d.rooms.filter((r) => r.daycareId === daycareId);

export const getChildrenInRoom = (d: AppData, roomId: ID) =>
  d.children.filter((c) => c.roomId === roomId);

export const getChildrenInDaycare = (d: AppData, daycareId: ID) => {
  const roomIds = new Set(getRoomsForDaycare(d, daycareId).map((r) => r.id));
  return d.children.filter((c) => roomIds.has(c.roomId));
};

export const getUsersForDaycare = (d: AppData, daycareId: ID) =>
  d.users.filter((u) => u.daycareIds.includes(daycareId)).sort((a, b) => a.name.localeCompare(b.name));

export const getGuardians = (d: AppData, child: Child) =>
  child.guardianIds.map((id) => getUser(d, id)).filter((u) => u !== undefined);

export function getParentNames(d: AppData, child: Child) {
  const names = getGuardians(d, child).map((u) => u.name);
  const parentPickup = child.authorisedPickups.find((p) => p.relation === 'Father' || p.relation === 'Mother');
  if (parentPickup && !names.includes(parentPickup.name)) names.push(parentPickup.name);
  if (names.length === 0) return 'No parent linked';
  if (names.length === 1) return names[0];
  const last = names.map((n) => n.split(' ').at(-1));
  return last[0] === last[1]
    ? `${names[0].split(' ')[0]} and ${names[1]}`
    : `${names[0]} and ${names[1]}`;
}

// ---------- Presenças ----------

export const getAttendance = (d: AppData, childId: ID, date: ISODate = TODAY) =>
  d.attendance.find((a) => a.childId === childId && a.date === date);

export function getAttendanceStatus(d: AppData, childId: ID, date: ISODate = TODAY): AttendanceStatus {
  const a = getAttendance(d, childId, date);
  if (a?.checkOut) return 'left';
  if (a?.checkIn) return 'present';
  return 'expected';
}

export function getRoomAttendanceSummary(d: AppData, roomId: ID, date: ISODate = TODAY) {
  const summary = { present: 0, expected: 0, left: 0, total: 0 };
  for (const child of getChildrenInRoom(d, roomId)) {
    summary[getAttendanceStatus(d, child.id, date)] += 1;
    summary.total += 1;
  }
  return summary;
}

export function getAttendanceForDaycare(d: AppData, daycareId: ID, date: ISODate) {
  const childIds = new Set(getChildrenInDaycare(d, daycareId).map((c) => c.id));
  return d.attendance.filter((a) => a.date === date && childIds.has(a.childId) && a.checkIn);
}

// ---------- Diário ----------

export const getRecordsForChild = (d: AppData, childId: ID, date: ISODate = TODAY) =>
  d.records.filter((r) => r.childId === childId && r.date === date).sort(byTime);

export const getRecentRecords = (d: AppData, childId: ID, limit = 5) =>
  d.records
    .filter((r) => r.childId === childId)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .slice(0, limit);

type RecordOf<T extends DailyRecord['type']> = Extract<DailyRecord, { type: T }>;
const ofType = <T extends DailyRecord['type']>(records: DailyRecord[], type: T) =>
  records.filter((r): r is RecordOf<T> => r.type === type);

export function getDailySummary(d: AppData, childId: ID, date: ISODate = TODAY) {
  const records = getRecordsForChild(d, childId, date);
  const meals = ofType(records, 'meal');
  const sleeps = ofType(records, 'sleep');
  const hygiene = ofType(records, 'hygiene');
  const moods = ofType(records, 'mood');

  return {
    meals: { count: meals.length, planned: 4, lunch: meals.find((m) => m.meal === 'lunch') },
    sleep: {
      minutes: sleeps.reduce((sum, s) => sum + minutesBetween(s.start, s.end), 0),
      last: sleeps.at(-1),
    },
    hygiene: { count: hygiene.length, lastTime: hygiene.at(-1)?.time },
    mood: moods.at(-1) as { mood: Mood; note?: string } | undefined,
  };
}

export const getActivitiesForChild = (d: AppData, childId: ID) =>
  d.activities
    .filter((a) => a.childIds.includes(childId))
    .sort((a, b) => b.date.localeCompare(a.date));

export const getActivitiesForRoom = (d: AppData, roomId: ID) =>
  d.activities.filter((a) => a.roomId === roomId).sort((a, b) => b.date.localeCompare(a.date));

export const getDevelopmentReports = (d: AppData, childId: ID) =>
  d.development.filter((r) => r.childId === childId).sort((a, b) => a.term - b.term);

export const getMilestones = (d: AppData, childId: ID) =>
  d.milestones.filter((m) => m.childId === childId).sort((a, b) => b.date.localeCompare(a.date));

export const getActivity = (d: AppData, id: ID) => d.activities.find((a) => a.id === id);

export function getDaysWithRecords(d: AppData, childId: ID, month: string) {
  const days = new Set<ISODate>();
  d.records.forEach((r) => r.childId === childId && r.date.startsWith(month) && days.add(r.date));
  d.activities.forEach((a) => a.childIds.includes(childId) && a.date.startsWith(month) && days.add(a.date));
  return days;
}

export const getPortfolio = (d: AppData, childId: ID) =>
  d.portfolio.filter((p) => p.childId === childId).sort((a, b) => b.date.localeCompare(a.date));

// ---------- Comunicação ----------

export const getMessages = (d: AppData, conversationId: ID) =>
  d.messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));

export function getConversationsForUser(d: AppData, userId: ID) {
  return d.conversations
    .filter((c) => c.participantIds.includes(userId))
    .map((conversation) => {
      const msgs = getMessages(d, conversation.id);
      return {
        conversation,
        lastMessage: msgs.at(-1),
        unread: msgs.filter((m) => !m.readBy.includes(userId)).length,
      };
    })
    .sort((a, b) => (b.lastMessage?.sentAt ?? '').localeCompare(a.lastMessage?.sentAt ?? ''));
}

export const getNotifications = (d: AppData, userId: ID) =>
  d.notifications.filter((n) => n.userId === userId).sort((a, b) => b.date.localeCompare(a.date));

export const getUnreadNotificationsCount = (d: AppData, userId: ID) =>
  getNotifications(d, userId).filter((n) => !n.read).length;

// ---------- Faturação ----------

export const getPaidAmount = (invoice: Invoice) => invoice.payments.reduce((sum, p) => sum + p.amount, 0);

export function getInvoiceStatus(invoice: Invoice, today: ISODate = TODAY): InvoiceStatus {
  if (getPaidAmount(invoice) >= invoice.amount) return 'paid';
  return invoice.dueDate < today ? 'overdue' : 'unpaid';
}

export const getInvoicesForChild = (d: AppData, childId: ID) =>
  d.invoices.filter((i) => i.childId === childId).sort((a, b) => b.month.localeCompare(a.month));

export function getInvoicesForDaycare(d: AppData, daycareId: ID) {
  const childIds = new Set(getChildrenInDaycare(d, daycareId).map((c) => c.id));
  return d.invoices.filter((i) => childIds.has(i.childId)).sort((a, b) => b.number.localeCompare(a.number));
}

const outstanding = (invoices: Invoice[]) => {
  const open = invoices.filter((i) => getInvoiceStatus(i) !== 'paid');
  return { total: open.reduce((sum, i) => sum + i.amount - getPaidAmount(i), 0), count: open.length };
};

export function getParentBilling(d: AppData, child: Child) {
  const invoices = getInvoicesForChild(d, child.id);
  const year = TODAY.slice(0, 4);
  return {
    invoices,
    due: outstanding(invoices),
    nextDue: invoices.find((i) => getInvoiceStatus(i) !== 'paid'),
    paidThisYear: invoices
      .flatMap((i) => i.payments)
      .filter((p) => p.date.startsWith(year))
      .reduce((sum, p) => sum + p.amount, 0),
  };
}

// ---------- Dashboard da administração ----------

export function getDaycareStats(d: AppData, daycareId: ID, date: ISODate = TODAY) {
  const rooms = getRoomsForDaycare(d, daycareId);
  const children = getChildrenInDaycare(d, daycareId);
  const present = children.filter((c) => getAttendanceStatus(d, c.id, date) === 'present').length;
  const educatorIds = new Set(rooms.flatMap((r) => r.educatorIds));

  return {
    children: children.length,
    rooms: rooms.length,
    present,
    absent: children.length - present,
    educators: educatorIds.size,
    outstanding: outstanding(getInvoicesForDaycare(d, daycareId)),
    attendanceByRoom: rooms.map((room) => {
      const s = getRoomAttendanceSummary(d, room.id, date);
      return { room, present: s.present, total: s.total };
    }),
  };
}

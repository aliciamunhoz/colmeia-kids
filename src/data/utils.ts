import type { ISODate, ISODateTime, Time } from '@/types/models';

// "Hoje" da demo. O protótipo do Figma passa-se na sexta, 25 de setembro de 2026,
// e os dados iniciais foram escritos à volta desse dia. Fixar a data garante que
// o diário, as presenças e as faturas aparecem sempre como no Figma.
// Para usar a data real, troque por: new Date().toISOString().slice(0, 10)
export const TODAY: ISODate = '2026-09-25';

export function nowTime(): Time {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function nowDateTime(): ISODateTime {
  return `${TODAY}T${nowTime()}`;
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function isEmailTaken(users: readonly { id: string; email: string }[], email: string, exceptUserId?: string) {
  const normalizedEmail = normalizeEmail(email);
  return users.some((user) => user.id !== exceptUserId && normalizeEmail(user.email) === normalizedEmail);
}

// ---------- Formatação ----------

const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
export const formatCurrency = (value: number) => currency.format(value);

export function minutesBetween(start: Time, end: Time) {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  return h2 * 60 + m2 - (h1 * 60 + m1);
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`; 
}

// ---------- Datas ----------

const toDate = (iso: ISODate) => new Date(`${iso}T12:00:00Z`);
const toISO = (d: Date): ISODate => d.toISOString().slice(0, 10);

export const WEEKDAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function daysBetweenDates(from: ISODate, to: ISODate) {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86_400_000);
}

export const isFutureDate = (date: ISODate, today: ISODate = TODAY) => date > today;

export function addDays(iso: ISODate, days: number): ISODate {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

export const weekdayIndex = (iso: ISODate) => toDate(iso).getUTCDay();

export function getWeekdays(iso: ISODate): ISODate[] {
  const day = weekdayIndex(iso);
  const monday = addDays(iso, day === 0 ? -6 : 1 - day);
  return [0, 1, 2, 3, 4].map((i) => addDays(monday, i));
}

export const dayOfMonth = (iso: ISODate) => Number(iso.slice(8, 10));

export function formatShortDate(iso: ISODate) {
  return `${dayOfMonth(iso)} ${MONTHS[Number(iso.slice(5, 7)) - 1].slice(0, 3)}`;
}
export function formatLongDate(iso: ISODate) {
  const weekday = toDate(iso).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
  return `${weekday}, ${formatShortDate(iso)}`;
}

export function formatRelativeDay(iso: ISODate) {
  const diff = daysBetweenDates(iso, TODAY);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1 && diff < 7) return toDate(iso).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
  return formatShortDate(iso);
}

export const dateFromDateTime = (dateTime: ISODateTime): ISODate => dateTime.slice(0, 10);

export const timeFromDateTime = (dateTime: ISODateTime): Time => dateTime.slice(11, 16);

export function formatDateTime(dateTime: ISODateTime) {
  return `${formatShortDate(dateFromDateTime(dateTime))}, ${timeFromDateTime(dateTime)}`;
}

export function formatWhen(dateTime: ISODateTime) {
  const date = dateFromDateTime(dateTime);
  const time = timeFromDateTime(dateTime);
  return date === TODAY ? time : formatRelativeDay(date);
}

export function getMonthGrid(month: string): (ISODate | null)[][] {
  const first = `${month}-01`;
  const offset = (weekdayIndex(first) + 6) % 7;
  const days: (ISODate | null)[] = Array(offset).fill(null);
  for (let d = first; d.startsWith(month); d = addDays(d, 1)) days.push(d);
  while (days.length % 7) days.push(null);
  return Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7));
}

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export const formatMonth = (month: string) => `${MONTHS[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;

// ---------- Campos de formulário (formato português) ----------

export const toDisplayDate = (iso: ISODate) => iso.split('-').reverse().join('/');

export function parseDisplayDate(value: string): ISODate | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  return toISO(toDate(iso)) === iso ? iso : null;
}

export const isValidTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim());

export function ageFrom(birthDate: ISODate, today: ISODate = TODAY) {
  const [by, bm, bd] = birthDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  let months = (ty - by) * 12 + (tm - bm);
  if (td < bd) months -= 1;
  return { years: Math.floor(months / 12), months: months % 12 };
}

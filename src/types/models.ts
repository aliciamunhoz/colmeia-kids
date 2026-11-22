import type { AvatarName } from '@/components/Avatar/avatars';
import type { IconName } from '@/components/Icon/icons';
import type { Tone } from '@/theme/colors';

export type ID = string;
export type ISODate = string;
export type Time = string;
export type ISODateTime = string;

export type Cover = { icon: IconName; tone: Tone };

// ---------- Pessoas e organização ----------

export type Role = 'parent' | 'educator' | 'admin';

export type Daycare = {
  id: ID;
  name: string;
  city: string;
  address: string;
  phone: string;
  openingHours: string;
  prices: { fullTime: number; halfDay: number; meals: number };
  coordinates?: { latitude: number; longitude: number };
};

export type Room = {
  id: ID;
  daycareId: ID;
  name: string;
  capacity: number;
  educatorIds: ID[];
  ageRange: string;
  tone: Tone;
};

export type User = {
  id: ID;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: AvatarName;
  phone?: string;
  address?: string;
  daycareIds: ID[];
  blocked?: boolean;
  pushNotifications?: boolean;
  passwordChangedAt?: ISODate;
  permissions?: Permission[];
  invitedAt?: ISODateTime;
};

export type Permission = 'diary' | 'announcements' | 'portfolio' | 'billing';

export type AuthorisedPickup = {
  name: string;
  relation: string;
  phone: string;
  avatar?: AvatarName;
  mainContact?: boolean;
  idChecked: boolean;
  until?: ISODate;
};

export type Child = {
  id: ID;
  name: string;
  birthDate: ISODate;
  roomId: ID;
  avatar: AvatarName;
  allergies: string[];
  notes?: string;
  guardianIds: ID[];
  authorisedPickups: AuthorisedPickup[];
  monthlyFee: number;
  feePlan?: 'fullTime' | 'halfDay';
  mealsIncluded?: boolean;
  startDate?: ISODate;
};

// ---------- Dia a dia ----------

export type Attendance = {
  id: ID;
  childId: ID;
  date: ISODate;
  checkIn?: { time: Time; byName: string; method: 'qr' | 'manual' };
  checkOut?: { time: Time; byName: string; method: 'qr' | 'manual' };
  absence?: { reason: string };
  parentsNotifiedAt?: ISODateTime;
};

export type AttendanceStatus = 'expected' | 'present' | 'left';

export type MealAmount = 'none' | 'little' | 'half' | 'almostAll' | 'all';
export type Mood = 'happy' | 'calm' | 'sad' | 'grumpy' | 'tired';
export type Behaviour = 'calm' | 'restless' | 'engaged';
export type Wellbeing = 'well' | 'feverish' | 'discomfort';
export type IncidentKind = 'fall' | 'bite' | 'fever' | 'scratch' | 'other';

type RecordBase = {
  id: ID;
  childId: ID;
  date: ISODate;
  time: Time;
  createdBy: ID;
};

export type DailyRecord =
  | (RecordBase & { type: 'meal'; meal: 'breakfast' | 'lunch' | 'snack'; description: string; amount: MealAmount })
  | (RecordBase & { type: 'sleep'; start: Time; end: Time; note?: string })
  | (RecordBase & { type: 'hygiene'; description: string })
  | (RecordBase & { type: 'mood'; mood: Mood; behaviour?: Behaviour; wellbeing?: Wellbeing; note?: string })
  | (RecordBase & { type: 'incident'; kind: IncidentKind; description: string; notes?: string })
  | (RecordBase & { type: 'note'; text: string });

export type Activity = {
  id: ID;
  roomId: ID;
  educatorId: ID;
  date: ISODate;
  time: Time;
  title: string;
  category: 'art' | 'outdoor' | 'music' | 'story' | 'sensory';
  description: string;
  objectives: string[];
  photos: Cover[];
  childIds: ID[];
  educatorNote?: string;
};

export type DevelopmentLevel = 1 | 2 | 3 | 4;
export type DevelopmentArea = { name: string; level: DevelopmentLevel };

export type DevelopmentReport = {
  id: ID;
  childId: ID;
  term: 1 | 2 | 3;
  title: string;
  recordedBy: ID;
  date: ISODate;
  areas: DevelopmentArea[];
  comment: string;
};

export type Milestone = { id: ID; childId: ID; date: ISODate; title: string; area: string; cover: Cover };

export type PortfolioItem = {
  id: ID;
  childId: ID;
  date: ISODate;
  kind: 'photo' | 'video' | 'artwork' | 'progress';
  title: string;
  description: string;
  cover: Cover;
  authorId: ID;
  duration?: string;
  activityId?: ID;
};

// ---------- Comunicação ----------

export type Conversation = {
  id: ID;
  type: 'direct' | 'room' | 'daycare';
  title: string;
  participantIds: ID[];
  roomId?: ID;
};

export type Message = {
  id: ID;
  conversationId: ID;
  senderId: ID;
  text: string;
  sentAt: ISODateTime;
  readBy: ID[];
  attachment?: { kind: 'photo'; cover: Cover };
};

export type Announcement = {
  id: ID;
  daycareId: ID;
  roomId?: ID;
  authorId: ID;
  title: string;
  body: string;
  date: ISODate;
};

export type NotificationKind = 'message' | 'photo' | 'activity' | 'event' | 'notice' | 'schedule' | 'invoice';

export type AppNotification = {
  id: ID;
  userId: ID;
  kind: NotificationKind;
  title: string;
  body: string;
  date: ISODateTime;
  read: boolean;
};

// ---------- Faturação ----------

export type PaymentMethod = 'mbway' | 'multibanco' | 'transfer' | 'debit' | 'card' | 'cash';

export type Payment = { date: ISODate; amount: number; method: PaymentMethod; reference?: string; notes?: string };

export type InvoiceItem = { label: string; detail: string; amount: number };

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export type Invoice = {
  id: ID;
  number: string;
  childId: ID;
  month: string;
  description: string;
  amount: number;
  dueDate: ISODate;
  payments: Payment[];
  items?: InvoiceItem[];
  issuedAt?: ISODateTime;
  issuedBy?: ID;
  methods?: PaymentMethod[];
  reminders?: ISODateTime[];
};

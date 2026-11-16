import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ---------- Autenticação ----------
export type AuthStackParamList = {
  Login: undefined;
  PasswordRecovery: { email?: string } | undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;

// ---------- Encarregado (parent) ----------
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  Activities: undefined;
  ActivityDetail: { activityId: string };
  Development: undefined;
  Portfolio: undefined;
  Payments: undefined;
  Location: undefined;
};

export type DiaryStackParamList = {
  Diary: { date?: string } | undefined;
  Calendar: { date: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  ChangePassword: undefined;
};

export type ParentTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  DiaryTab: NavigatorScreenParams<DiaryStackParamList>;
  CheckIn: undefined;
  Messages: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type ParentStackParamList = {
  ParentTabs: NavigatorScreenParams<ParentTabParamList>;
  Chat: { conversationId: string };
};

type ParentRoot = NativeStackScreenProps<ParentStackParamList>;
type ParentTabs<T extends keyof ParentTabParamList> = CompositeScreenProps<BottomTabScreenProps<ParentTabParamList, T>, ParentRoot>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  ParentTabs<'HomeTab'>
>;
export type DiaryScreenProps<T extends keyof DiaryStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DiaryStackParamList, T>,
  ParentTabs<'DiaryTab'>
>;
export type ProfileScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  ParentTabs<'ProfileTab'>
>;
export type ParentRootScreenProps<T extends keyof ParentStackParamList> = NativeStackScreenProps<ParentStackParamList, T>;

// ---------- Educadora ----------
export type RecordFormsParamList = {
  NewRecord: { childId: string; type?: 'meal' | 'sleep' | 'hygiene' };
  Mood: { childId: string };
  Assessment: { childId: string };
  Incident: { childId: string };
  AddToPortfolio: { childId: string };
};

export type RoomStackParamList = RecordFormsParamList & {
  Room: undefined;
  ChildProfile: { childId: string };
  AuthorisedPickup: { childId: string };
  ChildPortfolio: { childId: string };
  ChildActivities: { childId: string };
};

export type RecordsStackParamList = RecordFormsParamList & {
  Records: undefined;
};

export type EducatorTabParamList = {
  RoomTab: NavigatorScreenParams<RoomStackParamList>;
  RecordsTab: NavigatorScreenParams<RecordsStackParamList>;
  NewActivity: undefined;
  Messages: undefined;
  Announce: undefined;
};

export type EducatorStackParamList = {
  EducatorTabs: NavigatorScreenParams<EducatorTabParamList>;
  Chat: { conversationId: string };
};

type EducatorTabs<T extends keyof EducatorTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<EducatorTabParamList, T>,
  NativeStackScreenProps<EducatorStackParamList>
>;
export type RoomScreenProps<T extends keyof RoomStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RoomStackParamList, T>,
  EducatorTabs<'RoomTab'>
>;
export type RecordsScreenProps<T extends keyof RecordsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RecordsStackParamList, T>,
  EducatorTabs<'RecordsTab'>
>;
export type EducatorTabScreenProps<T extends 'NewActivity' | 'Announce'> = EducatorTabs<T>;

// ---------- Administração ----------
export type AdminDrawerParamList = {
  Dashboard: undefined;
  Users: undefined;
  Children: undefined;
  Rooms: undefined;
  CheckIns: undefined;
  MonthlyFees: undefined;
  Invoices: undefined;
  Announcements: undefined;
};

export type DoneKind = 'user' | 'child' | 'invoice' | 'payment' | 'reminder';

export type AdminStackParamList = {
  AdminDrawer: NavigatorScreenParams<AdminDrawerParamList>;
  Search: undefined;
  AttendanceToday: undefined;
  UserForm: { userId?: string };
  ChildForm: { childId?: string };
  RoomForm: { roomId?: string };
  NewInvoice: { childId?: string } | undefined;
  InvoiceDetails: { invoiceId: string };
  RecordPayment: { invoiceId: string };
  AnnouncementForm: undefined;
  Done: { kind: DoneKind; id: string; created?: boolean };
};

export type AdminDrawerScreenProps<T extends keyof AdminDrawerParamList> = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, T>,
  NativeStackScreenProps<AdminStackParamList>
>;
export type AdminStackScreenProps<T extends keyof AdminStackParamList> = NativeStackScreenProps<AdminStackParamList, T>;

// ---------- Raiz ----------
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  ParentApp: NavigatorScreenParams<ParentStackParamList>;
  EducatorApp: NavigatorScreenParams<EducatorStackParamList>;
  AdminApp: NavigatorScreenParams<AdminStackParamList>;
};

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AnnouncementFormScreen } from '@/screens/admin/AnnouncementFormScreen';
import { AnnouncementsScreen } from '@/screens/admin/AnnouncementsScreen';
import { AttendanceTodayScreen } from '@/screens/admin/AttendanceTodayScreen';
import { CheckInsScreen } from '@/screens/admin/CheckInsScreen';
import { ChildFormScreen } from '@/screens/admin/ChildFormScreen';
import { ChildrenScreen } from '@/screens/admin/ChildrenScreen';
import { DashboardScreen } from '@/screens/admin/DashboardScreen';
import { DoneScreen } from '@/screens/admin/DoneScreen';
import { InvoiceDetailsScreen } from '@/screens/admin/InvoiceDetailsScreen';
import { InvoicesScreen } from '@/screens/admin/InvoicesScreen';
import { MonthlyFeesScreen } from '@/screens/admin/MonthlyFeesScreen';
import { NewInvoiceScreen } from '@/screens/admin/NewInvoiceScreen';
import { RecordPaymentScreen } from '@/screens/admin/RecordPaymentScreen';
import { RoomFormScreen } from '@/screens/admin/RoomFormScreen';
import { RoomsScreen } from '@/screens/admin/RoomsScreen';
import { SearchScreen } from '@/screens/admin/SearchScreen';
import { UserFormScreen } from '@/screens/admin/UserFormScreen';
import { UsersScreen } from '@/screens/admin/UsersScreen';
import { colors } from '@/theme';
import { AdminDrawerContent } from './AdminDrawerContent';
import { stackHeaderOptions } from './headerOptions';
import type { AdminDrawerParamList, AdminStackParamList } from './types';

const Stack = createNativeStackNavigator<AdminStackParamList>();
const Drawer = createDrawerNavigator<AdminDrawerParamList>();

function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 320 },
        drawerType: 'front',
        overlayColor: 'rgba(24, 35, 90, 0.45)',
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Users" component={UsersScreen} />
      <Drawer.Screen name="Children" component={ChildrenScreen} />
      <Drawer.Screen name="Rooms" component={RoomsScreen} />
      <Drawer.Screen name="CheckIns" component={CheckInsScreen} />
      <Drawer.Screen name="MonthlyFees" component={MonthlyFeesScreen} />
      <Drawer.Screen name="Invoices" component={InvoicesScreen} />
      <Drawer.Screen name="Announcements" component={AnnouncementsScreen} />
    </Drawer.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ ...stackHeaderOptions, headerShown: false }}>
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="AttendanceToday" component={AttendanceTodayScreen} />
      <Stack.Screen name="UserForm" component={UserFormScreen} />
      <Stack.Screen name="ChildForm" component={ChildFormScreen} />
      <Stack.Screen name="RoomForm" component={RoomFormScreen} />
      <Stack.Screen name="NewInvoice" component={NewInvoiceScreen} />
      <Stack.Screen name="InvoiceDetails" component={InvoiceDetailsScreen} />
      <Stack.Screen name="RecordPayment" component={RecordPaymentScreen} />
      <Stack.Screen name="AnnouncementForm" component={AnnouncementFormScreen} />
      <Stack.Screen name="Done" component={DoneScreen} options={{ presentation: 'modal', gestureEnabled: false }} />
    </Stack.Navigator>
  );
}

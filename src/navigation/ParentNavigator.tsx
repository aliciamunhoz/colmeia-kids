import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActivitiesScreen } from '@/screens/parent/ActivitiesScreen';
import { ActivityDetailScreen } from '@/screens/parent/ActivityDetailScreen';
import { CalendarScreen } from '@/screens/parent/CalendarScreen';
import { ChangePasswordScreen } from '@/screens/parent/ChangePasswordScreen';
import { CheckInScreen } from '@/screens/parent/CheckInScreen';
import { DevelopmentScreen } from '@/screens/parent/DevelopmentScreen';
import { DiaryScreen } from '@/screens/parent/DiaryScreen';
import { HomeScreen } from '@/screens/parent/HomeScreen';
import { LocationScreen } from '@/screens/parent/LocationScreen';
import { MessagesScreen } from '@/screens/shared/MessagesScreen';
import { NotificationsScreen } from '@/screens/parent/NotificationsScreen';
import { PaymentsScreen } from '@/screens/parent/PaymentsScreen';
import { PortfolioScreen } from '@/screens/parent/PortfolioScreen';
import { ProfileScreen } from '@/screens/parent/ProfileScreen';
import { SelectedChildProvider } from '@/screens/parent/SelectedChildContext';
import { ChatScreen } from '@/screens/shared/ChatScreen';
import { stackHeaderOptions } from './headerOptions';
import { TabBar, type TabItems } from './TabBar';
import type {
  DiaryStackParamList,
  HomeStackParamList,
  ParentStackParamList,
  ParentTabParamList,
  ProfileStackParamList,
} from './types';

const Root = createNativeStackNavigator<ParentStackParamList>();
const Tab = createBottomTabNavigator<ParentTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const DiaryStack = createNativeStackNavigator<DiaryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const screenOptions = { ...stackHeaderOptions, headerShown: false };

const tabItems: TabItems<ParentTabParamList> = {
  HomeTab: { label: 'Home', icon: 'home' },
  DiaryTab: { label: 'Diary', icon: 'calendar' },
  CheckIn: { label: 'Check-in', icon: 'qr', highlight: true },
  Messages: { label: 'Messages', icon: 'chat' },
  ProfileTab: { label: 'Profile', icon: 'user' },
};

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="Activities" component={ActivitiesScreen} />
      <HomeStack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <HomeStack.Screen name="Development" component={DevelopmentScreen} />
      <HomeStack.Screen name="Portfolio" component={PortfolioScreen} />
      <HomeStack.Screen name="Payments" component={PaymentsScreen} />
      <HomeStack.Screen name="Location" component={LocationScreen} />
    </HomeStack.Navigator>
  );
}

function DiaryNavigator() {
  return (
    <DiaryStack.Navigator screenOptions={screenOptions}>
      <DiaryStack.Screen name="Diary" component={DiaryScreen} />
      <DiaryStack.Screen name="Calendar" component={CalendarScreen} />
    </DiaryStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </ProfileStack.Navigator>
  );
}

function ParentTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} items={tabItems} />}
      backBehavior="history"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="DiaryTab" component={DiaryNavigator} />
      <Tab.Screen name="CheckIn" component={CheckInScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

export function ParentNavigator() {
  return (
    <SelectedChildProvider>
      <Root.Navigator screenOptions={screenOptions}>
        <Root.Screen name="ParentTabs" component={ParentTabs} />
        <Root.Screen name="Chat" component={ChatScreen} />
      </Root.Navigator>
    </SelectedChildProvider>
  );
}

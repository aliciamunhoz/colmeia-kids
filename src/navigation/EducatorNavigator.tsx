import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddToPortfolioScreen } from '@/screens/educator/AddToPortfolioScreen';
import { AnnounceScreen } from '@/screens/educator/AnnounceScreen';
import { AssessmentScreen } from '@/screens/educator/AssessmentScreen';
import { AuthorisedPickupScreen } from '@/screens/educator/AuthorisedPickupScreen';
import { ChildActivitiesScreen } from '@/screens/educator/ChildActivitiesScreen';
import { ChildPortfolioScreen } from '@/screens/educator/ChildPortfolioScreen';
import { ChildProfileScreen } from '@/screens/educator/ChildProfileScreen';
import { IncidentScreen } from '@/screens/educator/IncidentScreen';
import { MoodScreen } from '@/screens/educator/MoodScreen';
import { NewActivityScreen } from '@/screens/educator/NewActivityScreen';
import { NewRecordScreen } from '@/screens/educator/NewRecordScreen';
import { RecordsScreen } from '@/screens/educator/RecordsScreen';
import { RoomScreen } from '@/screens/educator/RoomScreen';
import { ChatScreen } from '@/screens/shared/ChatScreen';
import { MessagesScreen } from '@/screens/shared/MessagesScreen';
import { stackHeaderOptions } from './headerOptions';
import { TabBar, type TabItems } from './TabBar';
import type { EducatorStackParamList, EducatorTabParamList, RecordsStackParamList, RoomStackParamList } from './types';

const Root = createNativeStackNavigator<EducatorStackParamList>();
const Tab = createBottomTabNavigator<EducatorTabParamList>();
const RoomStack = createNativeStackNavigator<RoomStackParamList>();
const RecordsStack = createNativeStackNavigator<RecordsStackParamList>();

const screenOptions = { ...stackHeaderOptions, headerShown: false };

const tabItems: TabItems<EducatorTabParamList> = {
  RoomTab: { label: 'Room', icon: 'users' },
  RecordsTab: { label: 'Records', icon: 'edit' },
  NewActivity: { label: 'New', icon: 'plus', highlight: true },
  Messages: { label: 'Messages', icon: 'chat' },
  Announce: { label: 'Announce', icon: 'megaphone' },
};

function RoomNavigator() {
  return (
    <RoomStack.Navigator screenOptions={screenOptions}>
      <RoomStack.Screen name="Room" component={RoomScreen} />
      <RoomStack.Screen name="ChildProfile" component={ChildProfileScreen} />
      <RoomStack.Screen name="AuthorisedPickup" component={AuthorisedPickupScreen} />
      <RoomStack.Screen name="ChildPortfolio" component={ChildPortfolioScreen} />
      <RoomStack.Screen name="ChildActivities" component={ChildActivitiesScreen} />
      <RoomStack.Screen name="NewRecord" component={NewRecordScreen} />
      <RoomStack.Screen name="Mood" component={MoodScreen} />
      <RoomStack.Screen name="Assessment" component={AssessmentScreen} />
      <RoomStack.Screen name="Incident" component={IncidentScreen} />
      <RoomStack.Screen name="AddToPortfolio" component={AddToPortfolioScreen} />
    </RoomStack.Navigator>
  );
}

function RecordsNavigator() {
  return (
    <RecordsStack.Navigator screenOptions={screenOptions}>
      <RecordsStack.Screen name="Records" component={RecordsScreen} />
      <RecordsStack.Screen name="NewRecord" component={NewRecordScreen} />
      <RecordsStack.Screen name="Mood" component={MoodScreen} />
      <RecordsStack.Screen name="Assessment" component={AssessmentScreen} />
      <RecordsStack.Screen name="Incident" component={IncidentScreen} />
      <RecordsStack.Screen name="AddToPortfolio" component={AddToPortfolioScreen} />
    </RecordsStack.Navigator>
  );
}

function EducatorTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} items={tabItems} />}
      backBehavior="history"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="RoomTab" component={RoomNavigator} />
      <Tab.Screen name="RecordsTab" component={RecordsNavigator} />
      <Tab.Screen name="NewActivity" component={NewActivityScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Announce" component={AnnounceScreen} />
    </Tab.Navigator>
  );
}

export function EducatorNavigator() {
  return (
    <Root.Navigator screenOptions={screenOptions}>
      <Root.Screen name="EducatorTabs" component={EducatorTabs} />
      <Root.Screen name="Chat" component={ChatScreen} />
    </Root.Navigator>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { PasswordRecoveryScreen } from '@/screens/auth/PasswordRecoveryScreen';
import { AdminNavigator } from './AdminNavigator';
import { EducatorNavigator } from './EducatorNavigator';
import { stackHeaderOptions } from './headerOptions';
import { ParentNavigator } from './ParentNavigator';
import type { AuthStackParamList, RootStackParamList } from './types';

const Root = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ ...stackHeaderOptions, headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
    </AuthStack.Navigator>
  );
}

export function RootNavigator() {
  const { role } = useAuth();

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {role === null && <Root.Screen name="Auth" component={AuthNavigator} />}
        {role === 'parent' && <Root.Screen name="ParentApp" component={ParentNavigator} />}
        {role === 'educator' && <Root.Screen name="EducatorApp" component={EducatorNavigator} />}
        {role === 'admin' && <Root.Screen name="AdminApp" component={AdminNavigator} />}
      </Root.Navigator>
    </NavigationContainer>
  );
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}

import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';

import { getChild, useData } from '@/data';
import type { RecordFormsParamList } from '@/navigation/types';
import { useEducatorRoom } from './useEducatorRoom';

export function useRecordForm<T extends keyof RecordFormsParamList>() {
  const route = useRoute<RouteProp<RecordFormsParamList, T>>();
  const navigation = useNavigation();
  const { data, actions } = useData();
  const { user } = useEducatorRoom();
  const params = route.params as RecordFormsParamList[T];
  const child = getChild(data, params.childId);
  return { params, child, user, data, actions, goBack: () => navigation.goBack() };
}

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { useCurrentUser } from '@/context/AuthContext';
import { getChildrenForParent, getRoom, useData } from '@/data';
import type { Child, Room } from '@/types/models';

type SelectedChildValue = {
  childrenList: Child[];
  child: Child;
  room: Room | undefined;
  selectChild: (id: string) => void;
};

const SelectedChildContext = createContext<SelectedChildValue | null>(null);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const { data } = useData();
  const { user } = useCurrentUser();
  const childrenList = useMemo(() => getChildrenForParent(data, user.id), [data, user.id]);
  const [selectedId, setSelectedId] = useState(childrenList[0]?.id);

  const child = childrenList.find((c) => c.id === selectedId) ?? childrenList[0];

  const value = useMemo(
    () => (child ? { childrenList, child, room: getRoom(data, child.roomId), selectChild: setSelectedId } : null),
    [childrenList, child, data],
  );

  if (!value) {
    return null;
  }
  return <SelectedChildContext.Provider value={value}>{children}</SelectedChildContext.Provider>;
}

export function useSelectedChild() {
  const ctx = useContext(SelectedChildContext);
  if (!ctx) throw new Error('useSelectedChild tem de ser usado dentro de <SelectedChildProvider>');
  return ctx;
}

export const firstName = (name: string) => name.split(' ')[0];

import { useCurrentUser } from '@/context/AuthContext';
import { getChildrenInRoom, getRoomsForEducator, useData } from '@/data';

export function useEducatorRoom() {
  const { data } = useData();
  const { user } = useCurrentUser();
  const room = getRoomsForEducator(data, user.id)[0];
  const children = room ? getChildrenInRoom(data, room.id) : [];
  return { user, room, children };
}

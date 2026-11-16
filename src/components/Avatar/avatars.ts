import Admin from '../../../assets/avatars/admin.svg';
import Bee from '../../../assets/avatars/bee.svg';
import Child1 from '../../../assets/avatars/child1.svg';
import Child2 from '../../../assets/avatars/child2.svg';
import Child3 from '../../../assets/avatars/child3.svg';
import Child4 from '../../../assets/avatars/child4.svg';
import Educator from '../../../assets/avatars/educator.svg';
import Parent from '../../../assets/avatars/parent.svg';

export const avatars = {
  admin: Admin,
  bee: Bee,
  child1: Child1,
  child2: Child2,
  child3: Child3,
  child4: Child4,
  educator: Educator,
  parent: Parent,
} as const;

export type AvatarName = keyof typeof avatars;

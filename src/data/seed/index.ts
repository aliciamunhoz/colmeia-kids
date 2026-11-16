import type { AppData } from '../dataReducer';
import { invoices } from './billing';
import { announcements, conversations, messages, notifications } from './communication';
import { activities, attendance, development, milestones, portfolio, records } from './daily';
import { children, daycares, rooms, users } from './people';

// Estado inicial da app: é o que aparece na primeira abertura
// e quando se faz "Reset demo data".
export const seedData: AppData = {
  daycares,
  rooms,
  users,
  children,
  attendance,
  records,
  activities,
  development,
  milestones,
  portfolio,
  conversations,
  messages,
  announcements,
  notifications,
  invoices,
};

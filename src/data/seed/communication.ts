import type { Announcement, AppNotification, Conversation, Message } from '@/types/models';

// Ecrãs "08 Messages" e "09 Chat with educator".
export const conversations: Conversation[] = [
  { id: 'conv_sofia_ana', type: 'direct', title: 'Educator Sofia', participantIds: ['u_sofia', 'u_ana'], roomId: 'r_bees' },
  { id: 'conv_admin_ana', type: 'daycare', title: 'Administration', participantIds: ['u_rui_costa', 'u_ana'] },
  { id: 'conv_room_bees', type: 'room', title: 'Little Bees room', participantIds: ['u_sofia', 'u_ana', 'u_rui_santos', 'u_marta'], roomId: 'r_bees' },
  { id: 'conv_sofia_rui', type: 'direct', title: 'Rui Santos', participantIds: ['u_sofia', 'u_rui_santos'], roomId: 'r_bees' },
  { id: 'conv_admin_sofia', type: 'daycare', title: 'Administration', participantIds: ['u_rui_costa', 'u_sofia'] },
];

export const messages: Message[] = [
  { id: 'msg_1', conversationId: 'conv_sofia_ana', senderId: 'u_ana', text: 'Good morning! Tomás slept badly last night, he may be more tired.', sentAt: '2026-09-25T08:45', readBy: ['u_ana', 'u_sofia'] },
  { id: 'msg_2', conversationId: 'conv_sofia_ana', senderId: 'u_sofia', text: "Thanks for letting us know, Ana. We'll bring his nap forward a little.", sentAt: '2026-09-25T08:52', readBy: ['u_sofia', 'u_ana'] },
  // As 2 últimas ainda não foram lidas pela Ana → badge "2" no Figma
  { id: 'msg_3', conversationId: 'conv_sofia_ana', senderId: 'u_sofia', text: "Tomás loved today's painting activity!", sentAt: '2026-09-25T16:04', readBy: ['u_sofia'] },
  { id: 'msg_4', conversationId: 'conv_sofia_ana', senderId: 'u_sofia', text: '', sentAt: '2026-09-25T16:05', readBy: ['u_sofia'], attachment: { kind: 'photo', cover: { icon: 'sun', tone: 'blue' } } },

  { id: 'msg_5', conversationId: 'conv_admin_ana', senderId: 'u_rui_costa', text: 'The October invoice is now available.', sentAt: '2026-09-24T10:00', readBy: ['u_rui_costa', 'u_ana'] },

  { id: 'msg_6', conversationId: 'conv_room_bees', senderId: 'u_sofia', text: "On Friday we're going to the park.", sentAt: '2026-09-21T09:00', readBy: ['u_sofia', 'u_ana'] },

  { id: 'msg_7', conversationId: 'conv_sofia_rui', senderId: 'u_rui_santos', text: 'Leonor has a doctor appointment on Monday.', sentAt: '2026-09-25T09:30', readBy: ['u_rui_santos'] },
  { id: 'msg_8', conversationId: 'conv_admin_sofia', senderId: 'u_rui_costa', text: 'Staff meeting on Thursday at 18:00.', sentAt: '2026-09-23T17:00', readBy: ['u_rui_costa', 'u_sofia'] },
];

export const announcements: Announcement[] = [
  { id: 'ann_1', daycareId: 'dc_braganca', roomId: 'r_bees', authorId: 'u_sofia', title: 'Trip to the park', body: "On Friday we're going to the park. Please bring a cap and water bottle.", date: '2026-09-21' },
  { id: 'ann_2', daycareId: 'dc_braganca', authorId: 'u_rui_costa', title: 'Autumn party', body: 'Families are invited to our autumn party on 10 October at 16:00.', date: '2026-09-20' },
];

// Ecrã "10 Notifications" (2 por ler).
export const notifications: AppNotification[] = [
  { id: 'not_1', userId: 'u_ana', kind: 'message', title: 'New message', body: "Educator Sofia: Tomás loved the activity today!", date: '2026-09-25T16:05', read: false },
  { id: 'not_2', userId: 'u_ana', kind: 'photo', title: 'New photo', body: '3 photos added to the portfolio', date: '2026-09-25T15:40', read: false },
  { id: 'not_3', userId: 'u_ana', kind: 'activity', title: 'New activity', body: 'Finger painting', date: '2026-09-25T10:30', read: true },
  { id: 'not_4', userId: 'u_ana', kind: 'event', title: 'Event', body: 'Trip to the park · Friday, 2 Oct', date: '2026-09-24T18:00', read: true },
  { id: 'not_5', userId: 'u_ana', kind: 'notice', title: 'Daycare notice', body: 'Closed on 5 October (public holiday)', date: '2026-09-24T09:00', read: true },
  { id: 'not_6', userId: 'u_ana', kind: 'schedule', title: 'Schedule change', body: 'Pick-up at 17:30 on 9 Oct', date: '2026-09-21T12:00', read: true },
  { id: 'not_7', userId: 'u_ana', kind: 'invoice', title: 'New invoice', body: 'October fee · €320.00', date: '2026-09-21T10:00', read: true },
];

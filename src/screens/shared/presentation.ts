import type { IconName } from '@/components';
import { formatDuration, minutesBetween } from '@/data';
import type { Tone } from '@/theme';
import type { Conversation, DailyRecord, User, InvoiceStatus, MealAmount, Mood, NotificationKind } from '@/types/models';

type Pill = { label: string; tone: Tone; icon?: IconName };
export type RecordView = { icon: IconName; tone: Tone; title: string; subtitle?: string; pill?: Pill };

export const mealLabel = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack' } as const;

const amountPill: Record<MealAmount, Pill> = {
  all: { label: 'Ate everything', tone: 'green', icon: 'check' },
  almostAll: { label: 'Ate almost all', tone: 'green' },
  half: { label: 'Ate half', tone: 'honey' },
  little: { label: 'Ate a little', tone: 'honey' },
  none: { label: "Didn't eat", tone: 'red' },
};

export const moodLabel: Record<Mood, string> = {
  happy: 'Cheerful',
  calm: 'Calm',
  sad: 'Sad',
  grumpy: 'Grumpy',
  tired: 'Tired',
};

const incidentLabel = { fall: 'minor fall', bite: 'bite', fever: 'fever', scratch: 'scratch', other: 'other' } as const;

export function describeRecord(r: DailyRecord): RecordView {
  switch (r.type) {
    case 'meal':
      return { icon: 'utensils', tone: 'green', title: mealLabel[r.meal], subtitle: r.description, pill: amountPill[r.amount] };
    case 'sleep':
      return {
        icon: 'moon',
        tone: 'blue',
        title: `Nap · ${formatDuration(minutesBetween(r.start, r.end))}`,
        subtitle: `${r.start} – ${r.end}${r.note ? ` · ${r.note}` : ''}`,
      };
    case 'hygiene':
      return { icon: 'droplet', tone: 'blue', title: 'Hygiene', subtitle: r.description };
    case 'mood':
      return { icon: 'smile', tone: 'honey', title: `Mood: ${moodLabel[r.mood]}`, subtitle: r.note };
    case 'incident':
      return { icon: 'alert', tone: 'red', title: `Incident: ${incidentLabel[r.kind]}`, subtitle: r.description };
    case 'note':
      return { icon: 'chat', tone: 'honey', title: "Educator's note", subtitle: r.text };
  }
}

export const notificationView: Record<NotificationKind, { icon: IconName; tone: Tone }> = {
  message: { icon: 'chat', tone: 'blue' },
  photo: { icon: 'image', tone: 'green' },
  activity: { icon: 'palette', tone: 'honey' },
  event: { icon: 'calendar', tone: 'red' },
  notice: { icon: 'bell', tone: 'red' },
  schedule: { icon: 'settings', tone: 'purple' },
  invoice: { icon: 'file', tone: 'honey' },
};

export const invoiceStatusPill: Record<InvoiceStatus, Pill> = {
  unpaid: { label: 'Unpaid', tone: 'red' },
  paid: { label: 'Paid', tone: 'green' },
  overdue: { label: 'Overdue', tone: 'honey' },
};

export const activityCategoryLabel = {
  art: 'Activity',
  outdoor: 'Activity',
  music: 'Music',
  story: 'Story',
  sensory: 'Sensory',
} as const;

export function conversationTitle(c: Conversation, meId: string, users: User[]) {
  if (c.type !== 'direct') return c.title;
  const other = users.find((u) => u.id === c.participantIds.find((id) => id !== meId));
  if (!other) return c.title;
  return other.role === 'educator' ? `Educator ${other.name.split(' ')[0]}` : other.name;
}

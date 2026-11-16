import type { Activity, Attendance, DailyRecord, DevelopmentReport, Milestone, PortfolioItem } from '@/types/models';

// Presenças de hoje (25 set) — ecrã "15 Room":
// Tomás 08:42, Leonor 08:15, Beatriz saiu 16:30, Duarte 09:05; Martim e Matilde ainda não chegaram.
export const attendance: Attendance[] = [
  { id: 'att_1', childId: 'c_tomas', date: '2026-09-25', checkIn: { time: '08:42', byName: 'Ana Ferreira (mother)', method: 'qr' } },
  { id: 'att_2', childId: 'c_leonor', date: '2026-09-25', checkIn: { time: '08:15', byName: 'Rui Santos (father)', method: 'qr' } },
  { id: 'att_3', childId: 'c_beatriz_costa', date: '2026-09-25', checkIn: { time: '08:30', byName: 'Marta Costa (mother)', method: 'qr' }, checkOut: { time: '16:30', byName: 'Marta Costa (mother)', method: 'qr' } },
  { id: 'att_4', childId: 'c_duarte', date: '2026-09-25', checkIn: { time: '09:05', byName: 'Educator Sofia', method: 'manual' } },
  { id: 'att_5', childId: 'c_beatriz', date: '2026-09-25', checkIn: { time: '08:42', byName: 'Ana Ferreira (mother)', method: 'qr' } },
  { id: 'att_6', childId: 'c_maria', date: '2026-09-25', checkIn: { time: '08:50', byName: 'Educator', method: 'manual' } },
  { id: 'att_7', childId: 'c_gaspar', date: '2026-09-25', checkIn: { time: '09:10', byName: 'Educator', method: 'manual' } },
  // Matilde não veio: os pais avisaram (ecrã "25.1 Attendance": "Justified")
  { id: 'att_9', childId: 'c_matilde', date: '2026-09-25', absence: { reason: 'Doctor appointment' } },
  // Dia anterior (para o histórico)
  { id: 'att_8', childId: 'c_tomas', date: '2026-09-24', checkIn: { time: '08:35', byName: 'Ana Ferreira (mother)', method: 'qr' }, checkOut: { time: '17:10', byName: 'Paulo Ferreira (father)', method: 'qr' } },
];

// Diário do Tomás — ecrã "04 Diary" (sexta, 25) e variantes de segunda a quinta.
export const records: DailyRecord[] = [
  { id: 'rec_1', childId: 'c_tomas', date: '2026-09-25', time: '09:15', createdBy: 'u_sofia', type: 'meal', meal: 'breakfast', description: 'Milk and oat porridge', amount: 'all' },
  { id: 'rec_2', childId: 'c_tomas', date: '2026-09-25', time: '11:45', createdBy: 'u_sofia', type: 'hygiene', description: 'Nappy change · hand washing' },
  { id: 'rec_3', childId: 'c_tomas', date: '2026-09-25', time: '12:00', createdBy: 'u_sofia', type: 'meal', meal: 'lunch', description: 'Vegetable soup, rice with fish, fruit', amount: 'all' },
  { id: 'rec_4', childId: 'c_tomas', date: '2026-09-25', time: '12:50', createdBy: 'u_sofia', type: 'sleep', start: '12:50', end: '14:15', note: 'fell asleep easily' },
  { id: 'rec_5', childId: 'c_tomas', date: '2026-09-25', time: '15:10', createdBy: 'u_sofia', type: 'hygiene', description: 'Nappy change' },
  { id: 'rec_6', childId: 'c_tomas', date: '2026-09-25', time: '15:30', createdBy: 'u_sofia', type: 'meal', meal: 'snack', description: 'Yoghurt and bread', amount: 'half' },
  // Home: "Hygiene · 4 records · Last at 15:10"
  { id: 'rec_7', childId: 'c_tomas', date: '2026-09-25', time: '09:40', createdBy: 'u_sofia', type: 'hygiene', description: 'Hand washing' },
  { id: 'rec_8', childId: 'c_tomas', date: '2026-09-25', time: '14:30', createdBy: 'u_sofia', type: 'hygiene', description: 'Nappy change' },
  { id: 'rec_9', childId: 'c_tomas', date: '2026-09-25', time: '16:00', createdBy: 'u_sofia', type: 'mood', mood: 'happy', behaviour: 'engaged', wellbeing: 'well', note: 'Played a lot outside' },
  { id: 'rec_10', childId: 'c_tomas', date: '2026-09-25', time: '16:05', createdBy: 'u_sofia', type: 'note', text: 'He was all smiles and played a lot with Leonor.' },
  // Dias anteriores
  { id: 'rec_11', childId: 'c_tomas', date: '2026-09-24', time: '10:20', createdBy: 'u_sofia', type: 'incident', kind: 'fall', description: 'Tripped in the playground and hit his knee on the ground.', notes: 'Ice applied. He was fine and went back to playing.' },
  { id: 'rec_12', childId: 'c_tomas', date: '2026-09-24', time: '12:00', createdBy: 'u_sofia', type: 'meal', meal: 'lunch', description: 'Chicken soup, pasta, pear', amount: 'almostAll' },
  { id: 'rec_13', childId: 'c_tomas', date: '2026-09-24', time: '12:45', createdBy: 'u_sofia', type: 'sleep', start: '12:45', end: '14:30' },
  { id: 'rec_14', childId: 'c_tomas', date: '2026-09-23', time: '12:00', createdBy: 'u_sofia', type: 'meal', meal: 'lunch', description: 'Fish, potatoes and broccoli', amount: 'half' },
  { id: 'rec_15', childId: 'c_tomas', date: '2026-09-22', time: '12:00', createdBy: 'u_sofia', type: 'meal', meal: 'lunch', description: 'Lentil soup, rice with turkey', amount: 'all' },
  { id: 'rec_16', childId: 'c_tomas', date: '2026-09-21', time: '12:00', createdBy: 'u_sofia', type: 'meal', meal: 'lunch', description: 'Pumpkin soup, omelette', amount: 'little' },
  // Outra criança (para provar que os filtros por criança funcionam)
  { id: 'rec_17', childId: 'c_leonor', date: '2026-09-25', time: '12:00', createdBy: 'u_sofia', type: 'meal', meal: 'lunch', description: 'Vegetable soup, rice with fish', amount: 'almostAll' },
  { id: 'rec_18', childId: 'c_beatriz', date: '2026-09-25', time: '12:00', createdBy: 'u_ines', type: 'meal', meal: 'lunch', description: 'Lactose-free menu', amount: 'all' },
];

// Ecrãs "05 Activities" e "05.1 Activity – Finger painting".
export const activities: Activity[] = [
  {
    id: 'act_finger', roomId: 'r_bees', educatorId: 'u_sofia', date: '2026-09-25', time: '10:30',
    title: 'Finger painting', category: 'art',
    description: 'Exploring primary colours with washable paint on backdrop paper. Each child chose colours freely and mixed them with their hands.',
    objectives: ['Fine motor skills', 'Colours', 'Sensory play'],
    photos: [
      { icon: 'sun', tone: 'blue' },
      { icon: 'smile', tone: 'honey' },
      { icon: 'palette', tone: 'red' },
      { icon: 'star', tone: 'green' },
    ],
    childIds: ['c_tomas', 'c_leonor', 'c_beatriz_costa', 'c_martim'],
    educatorNote: 'Tomás loved mixing yellow and blue to make green. He always picked blue first!',
  },
  {
    id: 'act_garden', roomId: 'r_bees', educatorId: 'u_sofia', date: '2026-09-24', time: '11:00',
    title: 'Hive garden', category: 'outdoor',
    description: 'We planted beans and watched how seeds grow.',
    objectives: ['Nature', 'Autonomy'],
    photos: [
      { icon: 'sprout', tone: 'honey' },
      { icon: 'sun', tone: 'green' },
      { icon: 'droplet', tone: 'blue' },
      { icon: 'smile', tone: 'honey' },
    ],
    childIds: ['c_tomas', 'c_leonor', 'c_martim', 'c_matilde'],
    educatorNote: 'Tomás watered the beans every day this week.',
  },
  {
    id: 'act_music', roomId: 'r_ladybirds', educatorId: 'u_ines', date: '2026-09-25', time: '10:00',
    title: 'Music circle', category: 'music',
    description: 'Songs and percussion instruments.',
    objectives: ['Rhythm', 'Social'],
    photos: [{ icon: 'star', tone: 'purple' }],
    childIds: ['c_beatriz', 'c_rodrigo'],
  },
];

// Ecrã "06 Development" (Term 1, 2 e 3).
export const development: DevelopmentReport[] = [
  {
    id: 'dev_t1', childId: 'c_tomas', term: 1, title: 'September assessment', recordedBy: 'u_sofia', date: '2026-09-20',
    areas: [
      { name: 'Motor skills', level: 3 },
      { name: 'Language', level: 2 },
      { name: 'Cognitive', level: 3 },
      { name: 'Social', level: 4 },
      { name: 'Autonomy', level: 2 },
      { name: 'Artistic expression', level: 4 },
    ],
    comment: "Tomás now climbs stairs alternating feet and uses two-word sentences. We'll encourage him to ask for help with words.",
  },
  {
    id: 'dev_t2', childId: 'c_tomas', term: 2, title: 'January assessment', recordedBy: 'u_sofia', date: '2027-01-20',
    areas: [
      { name: 'Motor skills', level: 4 },
      { name: 'Language', level: 3 },
      { name: 'Cognitive', level: 3 },
      { name: 'Social', level: 4 },
      { name: 'Autonomy', level: 3 },
      { name: 'Artistic expression', level: 4 },
    ],
    comment: 'Planned assessment (example data for the prototype).',
  },
  {
    id: 'dev_t3', childId: 'c_tomas', term: 3, title: 'April assessment', recordedBy: 'u_sofia', date: '2027-04-20',
    areas: [
      { name: 'Motor skills', level: 4 },
      { name: 'Language', level: 4 },
      { name: 'Cognitive', level: 4 },
      { name: 'Social', level: 4 },
      { name: 'Autonomy', level: 4 },
      { name: 'Artistic expression', level: 4 },
    ],
    comment: 'Planned assessment (example data for the prototype).',
  },
];

export const milestones: Milestone[] = [
  { id: 'ms_1', childId: 'c_tomas', date: '2026-09-12', title: 'First running steps', area: 'Motor skills', cover: { icon: 'sprout', tone: 'green' } },
  { id: 'ms_2', childId: 'c_tomas', date: '2026-09-03', title: 'Says “water” and “more”', area: 'Language', cover: { icon: 'chat', tone: 'blue' } },
];

// Ecrã "07 Portfolio".
export const portfolio: PortfolioItem[] = [
  { id: 'pf_1', childId: 'c_tomas', date: '2026-09-25', kind: 'photo', title: 'Finger painting', description: '“First painting! He always picked blue.” — Educator Sofia', cover: { icon: 'sun', tone: 'blue' }, authorId: 'u_sofia', activityId: 'act_finger' },
  { id: 'pf_2', childId: 'c_tomas', date: '2026-09-25', kind: 'video', title: 'Singing time', description: 'Singing the bee song with the room.', cover: { icon: 'video', tone: 'red' }, authorId: 'u_sofia', duration: '0:42' },
  { id: 'pf_3', childId: 'c_tomas', date: '2026-09-24', kind: 'photo', title: 'Sunny morning', description: 'Playing in the garden.', cover: { icon: 'sun', tone: 'honey' }, authorId: 'u_sofia' },
  { id: 'pf_4', childId: 'c_tomas', date: '2026-09-24', kind: 'artwork', title: 'Colour mix', description: 'Yellow + blue = green!', cover: { icon: 'palette', tone: 'honey' }, authorId: 'u_sofia' },
  { id: 'pf_5', childId: 'c_tomas', date: '2026-09-22', kind: 'photo', title: 'Star helper', description: 'Helped tidy up the toys.', cover: { icon: 'star', tone: 'green' }, authorId: 'u_sofia' },
  { id: 'pf_6', childId: 'c_tomas', date: '2026-09-18', kind: 'photo', title: 'Hive garden', description: 'Watering the beans.', cover: { icon: 'image', tone: 'green' }, authorId: 'u_sofia', activityId: 'act_garden' },
  { id: 'pf_7', childId: 'c_tomas', date: '2026-09-15', kind: 'photo', title: 'Big smile', description: 'Story time.', cover: { icon: 'smile', tone: 'blue' }, authorId: 'u_sofia' },
  { id: 'pf_8', childId: 'c_tomas', date: '2026-09-12', kind: 'progress', title: 'First running steps', description: 'Motor skills milestone.', cover: { icon: 'sprout', tone: 'green' }, authorId: 'u_sofia' },
  { id: 'pf_9', childId: 'c_tomas', date: '2026-09-08', kind: 'photo', title: 'Snack time', description: 'Eating fruit on his own.', cover: { icon: 'image', tone: 'red' }, authorId: 'u_sofia' },
  { id: 'pf_10', childId: 'c_tomas', date: '2026-08-28', kind: 'artwork', title: 'Hand print', description: 'Summer hand print.', cover: { icon: 'palette', tone: 'purple' }, authorId: 'u_sofia' },
  { id: 'pf_11', childId: 'c_beatriz', date: '2026-09-25', kind: 'photo', title: 'Music circle', description: 'Playing the tambourine.', cover: { icon: 'star', tone: 'purple' }, authorId: 'u_ines', activityId: 'act_music' },
];

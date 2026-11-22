import type { AuthorisedPickup, Child, Daycare, Room, User } from '@/types/models';

// Nomes e números tirados dos ecrãs do Figma.
// Password de todas as contas da demo: colmeia123

export const daycares: Daycare[] = [
  { id: 'dc_braganca', name: 'Colmeia Daycare', city: 'Bragança', address: 'Rua das Abelhas, 12, 5300 Bragança', phone: '+351 273 000 000', openingHours: 'Mon to Fri · 07:30 – 19:00', prices: { fullTime: 280, halfDay: 210, meals: 40 }, coordinates: { latitude: 41.8061, longitude: -6.7567 } },
  { id: 'dc_porto', name: 'Colmeia Daycare', city: 'Porto', address: 'Rua do Mel, 45, 4000 Porto', phone: '+351 220 000 000', openingHours: 'Mon to Fri · 07:30 – 19:30', prices: { fullTime: 300, halfDay: 230, meals: 40 }, coordinates: { latitude: 41.1496, longitude: -8.6109 } },
];

export const users: User[] = [
  // Encarregados
  { id: 'u_ana', name: 'Ana Ferreira', email: 'ana.ferreira@email.pt', password: 'colmeia123', role: 'parent', avatar: 'parent', phone: '912 345 678', address: 'Rua Direita, 8, 5300 Bragança', daycareIds: ['dc_braganca'], pushNotifications: true, passwordChangedAt: '2026-06-20' },
  { id: 'u_rui_santos', name: 'Rui Santos', email: 'rui.santos@email.pt', password: 'colmeia123', role: 'parent', avatar: 'child4', phone: '913 222 111', daycareIds: ['dc_braganca'] },
  { id: 'u_marta', name: 'Marta Costa', email: 'marta.costa@email.pt', password: 'colmeia123', role: 'parent', avatar: 'child3', daycareIds: ['dc_braganca'] },
  // Educadoras
  { id: 'u_sofia', name: 'Sofia Ribeiro', email: 'sofia@colmeia.pt', password: 'colmeia123', role: 'educator', avatar: 'educator', phone: '915 444 333', daycareIds: ['dc_braganca'], permissions: ['diary', 'announcements', 'portfolio'] },
  { id: 'u_ines', name: 'Inês Martins', email: 'ines@colmeia.pt', password: 'colmeia123', role: 'educator', avatar: 'child2', daycareIds: ['dc_braganca'] },
  { id: 'u_joana', name: 'Joana Pires', email: 'joana@colmeia.pt', password: 'colmeia123', role: 'educator', avatar: 'child3', daycareIds: ['dc_porto'] },
  // Administração (pertence às duas creches)
  { id: 'u_rui_costa', name: 'Rui Costa', email: 'rui.costa@colmeia.pt', password: 'colmeia123', role: 'admin', avatar: 'admin', daycareIds: ['dc_braganca', 'dc_porto'] },
];

export const rooms: Room[] = [
  { id: 'r_bees', daycareId: 'dc_braganca', name: 'Little Bees', capacity: 14, educatorIds: ['u_sofia'], ageRange: '1–2 years', tone: 'honey' },
  { id: 'r_ladybirds', daycareId: 'dc_braganca', name: 'Ladybirds', capacity: 18, educatorIds: ['u_ines'], ageRange: '2–3 years', tone: 'red' },
  { id: 'r_butterflies', daycareId: 'dc_braganca', name: 'Butterflies', capacity: 17, educatorIds: [], ageRange: '2–3 years', tone: 'purple' },
  { id: 'r_ants', daycareId: 'dc_braganca', name: 'Little Ants', capacity: 19, educatorIds: [], ageRange: '3 years', tone: 'green' },
  { id: 'r_crickets', daycareId: 'dc_braganca', name: 'Crickets', capacity: 18, educatorIds: [], ageRange: '3 years', tone: 'blue' },
  { id: 'r_porto_sun', daycareId: 'dc_porto', name: 'Sunflowers', capacity: 15, educatorIds: ['u_joana'], ageRange: '1–3 years', tone: 'honey' },
];

const anaPickups: AuthorisedPickup[] = [
  { name: 'Ana Ferreira', relation: 'Mother', phone: '+351 912 345 678', avatar: 'parent', mainContact: true, idChecked: true },
  { name: 'João Ferreira', relation: 'Father', phone: '+351 913 456 789', avatar: 'admin', idChecked: true },
  { name: 'Maria Ferreira', relation: 'Grandmother', phone: '+351 914 567 890', idChecked: true, until: '2026-12-31' },
]

export const children: Child[] = [
  // Little Bees (sala da educadora Sofia) — lista do ecrã "15 Room"
  { id: 'c_tomas', name: 'Tomás Ferreira', birthDate: '2024-05-12', roomId: 'r_bees', avatar: 'child1', allergies: [], notes: 'Sleeps with a dummy.', guardianIds: ['u_ana'], authorisedPickups: anaPickups, monthlyFee: 320, feePlan: 'fullTime', mealsIncluded: true },
  { id: 'c_leonor', name: 'Leonor Santos', birthDate: '2024-03-02', roomId: 'r_bees', avatar: 'child2', allergies: ['nuts'], guardianIds: ['u_rui_santos'], authorisedPickups: [{ name: 'Rui Santos', relation: 'Father', phone: '913 222 111', mainContact: true, idChecked: true }], monthlyFee: 320, feePlan: 'fullTime', mealsIncluded: true },
  { id: 'c_beatriz_costa', name: 'Beatriz Costa', birthDate: '2024-01-20', roomId: 'r_bees', avatar: 'child3', allergies: [], guardianIds: ['u_marta'], authorisedPickups: [{ name: 'Marta Costa', relation: 'Mother', phone: '916 000 222', mainContact: true, idChecked: true }], monthlyFee: 320, feePlan: 'fullTime', mealsIncluded: true },
  { id: 'c_martim', name: 'Martim Alves', birthDate: '2024-07-08', roomId: 'r_bees', avatar: 'child4', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 288, feePlan: 'fullTime', mealsIncluded: true },
  { id: 'c_duarte', name: 'Duarte Lopes', birthDate: '2024-02-14', roomId: 'r_bees', avatar: 'child1', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 320, feePlan: 'fullTime', mealsIncluded: true },
  { id: 'c_matilde', name: 'Matilde Rocha', birthDate: '2024-06-30', roomId: 'r_bees', avatar: 'child3', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 320, feePlan: 'fullTime', mealsIncluded: true },
  // Ladybirds — Beatriz é a 2.ª filha da Ana (ecrã "03.1 Home – Beatriz")
  { id: 'c_beatriz', name: 'Beatriz Ferreira', birthDate: '2023-04-18', roomId: 'r_ladybirds', avatar: 'child3', allergies: ['lactose'], guardianIds: ['u_ana'], authorisedPickups: anaPickups, monthlyFee: 210, feePlan: 'halfDay', mealsIncluded: false },
  { id: 'c_rodrigo', name: 'Rodrigo Sousa', birthDate: '2023-08-11', roomId: 'r_ladybirds', avatar: 'child4', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 300 },
  // Outras salas (para o dashboard ter números por sala)
  { id: 'c_maria', name: 'Maria Teixeira', birthDate: '2022-11-03', roomId: 'r_butterflies', avatar: 'child2', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 300 },
  { id: 'c_gaspar', name: 'Gaspar Nunes', birthDate: '2022-09-27', roomId: 'r_ants', avatar: 'child1', allergies: ['gluten'], guardianIds: [], authorisedPickups: [], monthlyFee: 300 },
  { id: 'c_alice', name: 'Alice Moreira', birthDate: '2022-05-19', roomId: 'r_crickets', avatar: 'child3', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 300 },
  // Creche do Porto
  { id: 'c_vasco', name: 'Vasco Pinto', birthDate: '2023-10-01', roomId: 'r_porto_sun', avatar: 'child4', allergies: [], guardianIds: [], authorisedPickups: [], monthlyFee: 340 },
];

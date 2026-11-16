import type { Invoice } from '@/types/models';

// Ecrãs "12 Payments" (encarregado) e "34 Invoices" (administração).
// Repare que não existe campo `status`: pago / por pagar / em atraso é CALCULADO
// a partir dos pagamentos e da data limite (ver getInvoiceStatus em selectors.ts).
export const invoices: Invoice[] = [
  {
    id: 'inv_1043', number: 'FT 2026/1043', childId: 'c_tomas', month: '2026-10', description: 'Monthly fee + meals', amount: 320, dueDate: '2026-10-08', payments: [],
    items: [
      { label: 'Monthly fee', detail: 'Full-time', amount: 280 },
      { label: 'Meals', detail: 'Lunch and snacks', amount: 40 },
    ],
    issuedAt: '2026-09-21T10:00', issuedBy: 'u_rui_costa', methods: ['mbway', 'multibanco'],
  },
  { id: 'inv_0950', number: 'FT 2026/0950', childId: 'c_tomas', month: '2026-09', description: 'Monthly fee + meals', amount: 320, dueDate: '2026-09-08', payments: [{ date: '2026-09-05', amount: 320, method: 'mbway' }] },
  { id: 'inv_0861', number: 'FT 2026/0861', childId: 'c_tomas', month: '2026-08', description: 'Monthly fee + meals', amount: 160, dueDate: '2026-08-08', payments: [{ date: '2026-08-04', amount: 160, method: 'multibanco' }] },
  { id: 'inv_1044', number: 'FT 2026/1044', childId: 'c_leonor', month: '2026-10', description: 'Monthly fee + meals', amount: 320, dueDate: '2026-10-08', payments: [{ date: '2026-09-22', amount: 320, method: 'card' }] },
  { id: 'inv_1045', number: 'FT 2026/1045', childId: 'c_beatriz', month: '2026-10', description: 'Monthly fee + meals', amount: 210, dueDate: '2026-10-08', payments: [] },
  { id: 'inv_0987', number: 'FT 2026/0987', childId: 'c_martim', month: '2026-09', description: 'Monthly fee + meals', amount: 288, dueDate: '2026-09-08', payments: [] },
];

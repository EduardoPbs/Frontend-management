export const months: { id: number; month: string }[] = [
    { id: 1, month: 'Janeiro' },
    { id: 2, month: 'Fevereiro' },
    { id: 3, month: 'Março' },
    { id: 4, month: 'Abril' },
    { id: 5, month: 'Maio' },
    { id: 6, month: 'Junho' },
    { id: 7, month: 'Julho' },
    { id: 8, month: 'Agosto' },
    { id: 9, month: 'Setembro' },
    { id: 10, month: 'Outubro' },
    { id: 11, month: 'Novembro' },
    { id: 12, month: 'Dezembro' },
];

const curr = new Date();
const monthNames: string[] = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

const dynamicMonths: { id: number; month: string; monthNumber: number }[] = [];
for (let i = 0; i < 12; i++) {
    const monthDate = new Date(curr);
    monthDate.setMonth(i);
    dynamicMonths.push({
        id: i,
        month: monthNames[i],
        monthNumber: monthDate.getMonth(),
    });
}

export { dynamicMonths };

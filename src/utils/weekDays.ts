const curr = new Date();
const firstDayOfWeek = curr.getDate() - curr.getDay() + 1;

const weekDays: { id: number; day: string; monthDay: number; month: number }[] =
    [];
for (let i = 0; i < 7; i++) {
    const day = new Date(curr);
    day.setDate(firstDayOfWeek + i);
    weekDays.push({
        id: i,
        day: getDayName(day),
        monthDay: day.getDate(),
        month: new Date().getMonth(),
    });
}

export { weekDays };

function getDayName(date: Date): string {
    const daysOfWeek = [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
    ];
    return daysOfWeek[date.getDay()];
}

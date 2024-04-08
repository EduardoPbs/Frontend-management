export function toFullLocaleDate(date: string): string {
    return `${new Date(date).toLocaleDateString('pt-Br')} - 
    ${new Date(date).getHours()}:${String(new Date(date).getMinutes()).padStart(
        2,
        '0'
    )}
    ${new Date(date).getHours() > 12 ? 'PM' : 'AM'}`;
}

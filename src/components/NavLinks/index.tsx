export function NavLink({ children }: { children: React.ReactNode }) {
    return (
        <ul className='flex items-end gap-4 h-full text-md select-none'>
            {children}
        </ul>
    );
}

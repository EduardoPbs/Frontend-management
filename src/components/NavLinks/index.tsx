export function NavLink({ children }: { children: React.ReactNode }) {
    return (
        <ul className='hidden xl:flex items-end gap-1 h-full text-md select-none'>
            {children}
        </ul>
    );
}

export function RowDetail({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex items-center justify-between text-primary-black gap-4 border-2 rounded-round-default min-h-[80px] border-border-gray hover:border-primary-red p-4 hover:bg-zinc-100/30 hover:shadow-md select-none duration-150'>
            {children}
        </div>
    );
}

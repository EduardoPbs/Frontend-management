export function RowDetail({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex items-center justify-between text-white gap-4 border-2 min-h-[80px] border-white/50 hover:border-amber-400 p-4 hover:bg-zinc-100/30 select-none duration-150'>
            {children}
        </div>
    );
}

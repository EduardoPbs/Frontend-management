export function RowDetail({ children, quantity }: { children: React.ReactNode; quantity: number }) {
    //'flex items-center justify-between text-primary-black gap-4 border-2 rounded-round-default min-h-[80px] border-border-gray hover:border-primary-red p-4 hover:bg-zinc-100/30 hover:shadow-md select-none duration-150'
    return (
        <div className={`${quantity < 1 ? 'opacity-40 bg-black/15 hover:bg-black/15 hover:border-border-gray hover:shadow-none' : 'border-border-gray hover:border-primary-red hover:bg-zinc-100/30 '} flex items-center justify-between flex-wrap text-primary-black gap-4 border-2 p-4 rounded-round-default hover:shadow-md select-none duration-150`}>
            {children}
        </div>
    );
}

export function Title({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant?: string;
}) {
    if (variant === 'h2') {
        return (
            <h2 className='text-2xl font-bold uppercase select-none'>
                {children}
            </h2>
        );
    }

    if (variant === 'h3') {
        return (
            <h3 className='text-xl font-bold uppercase select-none'>
                {children}
            </h3>
        );
    }
    return (
        <h1 className='text-4xl font-bold uppercase select-none'>{children}</h1>
    );
}

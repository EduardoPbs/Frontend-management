export function Title({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant?: string;
}) {
    const defaultStyle = 'font-bold uppercase select-none'

    if (variant === 'h2') {
        return (
            <h2 className={`text-2xl ${defaultStyle}`}>
                {children}
            </h2>
        );
    }

    if (variant === 'h3') {
        return (
            <h3 className={`text-xl ${defaultStyle}`}>
                {children}
            </h3>
        );
    }
    return (
        <h1 className={`text-4xl ${defaultStyle}`}>{children}</h1>
    );
}

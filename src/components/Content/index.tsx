import { twMerge } from 'tailwind-merge';

export function Content({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={twMerge(
                'flex flex-col gap-3 p-4 border-2 rounded-[4px] w-fit',
                className
            )}
        >
            {children}
        </div>
    );
}

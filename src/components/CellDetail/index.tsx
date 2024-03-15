import { twMerge } from 'tailwind-merge';

export function CellDetail({
    name,
    content,
    className = '',
    style = '',
}: {
    name: string;
    content: any;
    className?: string;
    style?: string;
}) {
    return (
        <p
            className={twMerge(
                'flex flex-col font-semibold text-lg min-w-[150px] w-[300px] max-w-full px-2 bg-white/5 rounded-md',
                className
            )}
        >
            {name}:{' '}
            <span
                className={twMerge('font-bold text-yellow-400 text-xl', style)}
            >
                {content}
            </span>
        </p>
    );
}

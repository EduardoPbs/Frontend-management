import { DrawerModal } from '../DrawerModal';
import { Title } from '../Title';

export function PageContainer({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <main className='flex flex-col justify-start gap-4 px-4 py-6 bg-black h-screen text-white selection:bg-amber-700 selection:text-white'>
            <header className='flex items-center justify-start gap-4'>
            <DrawerModal />

                <Title>{title}</Title>
            </header>

            <section className='flex flex-col gap-4 w-full h-fit overflow-hidden'>
                {children}
            </section>
        </main>
    );
}

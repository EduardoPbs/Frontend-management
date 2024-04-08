import { Header } from '../Header';

export function PageContainer({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <main className='flex flex-col justify-start gap-4 bg-primary-white h-screen text-white selection:bg-primary-hover-red selection:text-white'>
            <Header title={title} />

            <section className='flex flex-col gap-4 px-4 py-2 w-full h-fit overflow-hidden text-primary-black'>
                {children}
            </section>
        </main>
    );
}

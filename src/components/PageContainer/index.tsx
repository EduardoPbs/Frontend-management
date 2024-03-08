export function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <section className='flex flex-col justify-start gap-4 px-4 py-6 bg-black h-screen text-white selection:bg-amber-700 selection:text-white'>
            {children}
        </section>
    );
}

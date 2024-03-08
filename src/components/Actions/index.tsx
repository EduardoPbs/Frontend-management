import { Title } from '../Title';
import { Button } from '../Button';
import { Content } from '../Content';
import { Archive, PlusCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**@todo remove optional on functions */
interface ActionsProps {
    title: string;
    toCreate?: () => void;
    toView?: () => void;
    className?: string;
    style?: string;
}

export function Actions({
    title,
    toCreate,
    toView,
    className,
    style,
}: ActionsProps) {
    return (
        <Content className={twMerge('w-full', className)}>
            <Title variant='h2'>{title}</Title>

            <div
                className={twMerge('flex flex-col justify-center gap-2', style)}
            >
                <Button className='w-full' icon={PlusCircle} onClick={toCreate}>
                    Cadastrar
                </Button>

                <Button className='w-full' icon={Archive} onClick={toView}>
                    Todos
                </Button>
            </div>
        </Content>
    );
}

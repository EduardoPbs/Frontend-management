import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { useNavigate } from 'react-router';
import { PopoverClose } from '@radix-ui/react-popover';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function Actions({ id, status, handler }: { id: string; status: boolean; handler: (data: any) => any; }) {
    const { enableProduct, disableProduct } = useProduct();
    const navigate = useNavigate();

    return (
        <Popover>
            <PopoverTrigger>
                <Settings className='text-primary-black hover:text-primary-red hover:cursor-pointer duration-150' />
            </PopoverTrigger>
            <PopoverContent className='select-none relative w-fit flex items-center gap-2 bg-primary-white'>
                <div className='absolute top-0 right-20 -mt-2 size-4 rotate-45 bg-primary-white' />
                <Button onClick={() => { navigate(`edit/${id}`); }}>
                    Editar
                </Button>
                {status ? (
                    <PopoverClose asChild>
                        <Button
                            className='bg-primary-red hover:bg-primary-hover-red'
                            onClick={() => {
                                disableProduct(id);
                                handler((state: any) => !state);
                                location.reload();
                            }}
                        >
                            Desativar
                        </Button>
                    </PopoverClose>
                ) : (
                    <PopoverClose asChild>
                        <Button
                            className='bg-green-600 hover:bg-agreed-green'
                            onClick={() => {
                                enableProduct(id);
                                handler((state: any) => !state);
                                location.reload();
                            }}
                        >
                            Ativar
                        </Button>
                    </PopoverClose>
                )}
            </PopoverContent>
        </Popover>
    );
}
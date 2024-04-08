import { Spinner } from '@chakra-ui/react';
import { PageContainer } from '../PageContainer';
import { custom_red } from '../../constants/styles';

export function LgSpinner() {
    return (
        <PageContainer>
            <div className='flex items-center h-screen m-auto'>
                <Spinner size='xl' color={custom_red} />
            </div>
        </PageContainer>
    );
}

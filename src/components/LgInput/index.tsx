import { Input } from '@chakra-ui/react';
import { Controller } from "react-hook-form";

type LgInputProps = Partial<HTMLInputElement> & {
    label?: string;
    name?: string;
    errors?: any;
    control?: any;
    placeholder?: string;
    type?: string;
    autoComplete?: string;
};

export const LgInput: React.FC<LgInputProps> = ({
    label,
    name,
    errors,
    control,
    placeholder,
    type = 'text',
    autoComplete = '',
}: any) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className='flex-col justify-center w-full'>
                    <label htmlFor={name}>{label}</label>
                    <Input
                        id={name}
                        {...field}
                        type={type}
                        autoComplete={autoComplete}
                        focusBorderColor='yellow.500'
                        placeholder={placeholder}
                    />
                    {errors && (
                        <p className='text-red-500'>{String(errors.message)}</p>
                    )}
                </div>
            )}
        />
    );
};
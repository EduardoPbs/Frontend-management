import { Input } from '@chakra-ui/react';
import { Controller } from "react-hook-form";
import { primary_red } from '../../constants/styles';

type LgInputProps = Partial<HTMLInputElement> & {
    label?: string;
    name?: string;
    errors?: any;
    control?: any;
    placeholder?: string;
    type?: string;
    inputRadius?: number;
    autoComplete?: string;
    disabled?: boolean;
};

export const LgInput: React.FC<LgInputProps> = ({
    label,
    name,
    errors,
    control,
    placeholder,
    type = 'text',
    inputRadius = 4,
    autoComplete = '',
    disabled = false
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
                        disabled={disabled}
                        type={type}
                        autoComplete={autoComplete}
                        focusBorderColor={primary_red}
                        placeholder={placeholder}
                        borderRadius={inputRadius}
                    />
                    {errors && (
                        <p className='text-red-500'>{String(errors.message)}</p>
                    )}
                </div>
            )}
        />
    );
};
import { Button } from "@/components/ui/button";
import { Power, PowerOff } from "lucide-react";

interface FinalizeButtonProps {
    id: string;
    status: boolean;
    onTrueText?: string;
    onFalseText?: string;
}

export function FinalizeButton({ id, status, onTrueText = 'Finalizar', onFalseText = 'Ativar' }: FinalizeButtonProps) {
    return (
        <Button
            className="flex items-center gap-2 hover:bg-primary-hover-red w-1/2"
            onClick={() => { console.log(!status); console.log(id); }}
        >
            {status ? <PowerOff className='size-6' /> : <Power className='size-6' />}
            <p>{status ? onTrueText : onFalseText}</p>
        </Button>
    );
}
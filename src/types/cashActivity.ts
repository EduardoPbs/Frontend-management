import { Operations } from "./operations";

export type CashActivity = {
    id: string;
    operation: Operations;
    value: number;
    total: number;
}

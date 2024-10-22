import { http } from "@/service";
import { useEffect, useState } from "react";

export function UsePaymentType() {
    const [paymentTypes, setPaymentTypes] = useState<string[]>([]);

    async function getPaymentTypes() {
        try {
            const response = await http.get('/transactions/payment-types');
            console.log(response.data);
            setPaymentTypes(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getPaymentTypes();
    }, []);

    return {
        paymentTypes
    };
}
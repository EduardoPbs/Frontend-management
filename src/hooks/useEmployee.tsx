import { http } from '../service';
import { EmployeeEntity } from '../types/employee';
import { useEffect, useState } from 'react';

export function useEmployee() {
    const [dataEmployees, setDataEmployees] = useState<EmployeeEntity[]>([]);

    async function getDataEmployees() {
        try {
            const response = await http.get<EmployeeEntity[]>('/employees/all');
            if (!response.data) return;
            setDataEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDataEmployees();
    }, []);

    return { dataEmployees };
}

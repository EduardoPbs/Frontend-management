import { http } from '../service';
import { EmployeeEntity } from '../types/employee';
import { useEffect, useState } from 'react';

export function useEmployee() {
    const [dataEmployees, setDataEmployees] = useState<EmployeeEntity[]>([]);

    async function getDataEmployees() {
        try {
            const response = await http.get<EmployeeEntity[]>('/employees');
            if (!response.data) return;
            setDataEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getEmployeeById(
        id: string,
        setDataEmployee: (data: EmployeeEntity) => void
    ) {
        try {
            const response = await http.get(`/employees/${id}`);
            const employeeFounded = response.data;
            setDataEmployee(employeeFounded);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDataEmployees();
    }, []);

    return { dataEmployees, getEmployeeById };
}

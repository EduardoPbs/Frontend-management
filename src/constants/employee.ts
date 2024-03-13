export type EmployeeEntity = {
    id: string;
    name: string;
    cpf: number;
    address: DataAddress;
};

type DataAddress = {
    street: string;
    district: string;
    number: string;
    complement: string;
};

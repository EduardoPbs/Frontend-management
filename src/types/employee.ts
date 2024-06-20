export type EmployeeEntity = {
    id: string;
    nome: string;
    cpf: string;
    endereco: Endereco;
};

type Endereco = {
    rua: string;
    bairro: string;
    number: string;
    complemento: string;
};

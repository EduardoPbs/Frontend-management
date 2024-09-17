export type EmployeeEntity = {
    id: string;
    nome: string;
    cpf: string;
    endereco: Endereco;
    usuario: User
};

type Endereco = {
    rua: string;
    bairro: string;
    number: string;
    complemento: string;
};

type User = {
    email: string;
    password: string;
    is_admin?: boolean;
}

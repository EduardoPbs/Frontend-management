export type ProductEntity = {
    id: string;
    nome: string;
    codigo: number;
    valor: number;
    valorOriginal: number;
    categorias: string[];
    estoque: number;
    ativo: boolean;
};

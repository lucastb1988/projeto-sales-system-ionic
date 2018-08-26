export interface ProdutoDTO {
    id: string;
    nome: string;
    preco: number;
    imageUrl?: string; //? significa que este atributo é opcional, não precisa ser preenchido
}
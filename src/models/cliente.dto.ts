export interface ClienteDTO {
    id: string;
    nome: string;
    email: string;
    imageUrl?: string; //? significa que este atributo é opcional, não precisa ser preenchido
}
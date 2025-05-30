export interface DespesaDto {

    id: number;
    descricao: string;
    valor: number;
    data: string; 
    tipoDespesaId: number;
    recorrente: boolean;
    usuarioId: string;
    prioridade: string;
    ativo : boolean;
    frequenciaRecorrencia: string;

}
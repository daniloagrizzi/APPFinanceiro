export interface DespesaDto {

    id: number;
    descricao: string;
    valor: number;
    data: string; 
    tipoDespesaId: number;
    usuarioId: string;
    prioridade: string;
    recorrente : boolean;
    ativo : boolean;
    frequenciaRecorrencia : string;

}
'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';


export default function SorteioDeBitcoin(){ 

 const [numero, setNumero] = useState<number | null>(null);

 useEffect(() => {
    const fetchNumero = async () => {
      try {
        const res = await api.get('/Rosalem/GerarNumeroAleatorio');
        setNumero(res.data.numero);
      } catch (error) {
        console.error('Erro ao buscar número:', error);
      }
    };
  
    fetchNumero();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sorteio de Bitcoin!!!</h1>
        {numero !== null ? (
          <p className="text-2xl"> Parabéns, você acaba de ganhar {numero} bitcoins!!!</p>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </div>
  );
}
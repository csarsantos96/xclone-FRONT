// TesteRequisicao.jsx
import React, { useEffect } from 'react';
import { enviarRequisicao } from './apiService'; // ajuste o caminho conforme necessário

export default function TesteRequisicao() {
  useEffect(() => {
    enviarRequisicao();
  }, []);

  return <div>Verifique o console para ver a resposta da API.</div>;
}

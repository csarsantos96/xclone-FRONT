import React from 'react';
import { Link } from 'react-router-dom';
import './CheckYourEmailPage.css';

const CheckYourEmailPage = () => {
return (
    <div>
    <h2>Verifique seu E-mail</h2>
    <p>Um link de ativação foi enviado para o seu e-mail. Por favor, verifique sua caixa de entrada (e a pasta de spam). Clique no link para ativar sua conta.</p>
    <Link to="/login">Voltar para login</Link>
    </div>
);
};

export default CheckYourEmailPage;
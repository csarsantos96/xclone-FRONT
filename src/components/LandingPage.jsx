import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import './LandingPage.css'; 
import { Link } from 'react-router-dom';

import minhaLogo from '../images/twitter-cicle.png'

const LandingPage = () => {
return (
    <div className="landing-container">
      {/* Lado esquerdo com o logo grande */}
    <div className="landing-left">
        <div className="logo-container">
        <img
            src={minhaLogo} 
            alt="X Logo"
            className="logo"
        />
        </div>
    </div>

    
    <div className="landing-right">
        <h1 className="heading">Acontecendo agora</h1>
        <h2 className="subheading">Inscreva-se hoje</h2>

        <div className="login-buttons">
        <GoogleLoginButton />
      
        </div>

        <div className="or-container">
        <hr className="hr" />
        <span className="or-text">ou</span>
        <hr className="hr" />
        </div>

        <Link to="/signup" className="button create-account-btn">
            Criar conta
        </Link>

        <p className="termos">
        Ao inscrever-se, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
        
        <p className="existing-account"> 
        Já tem uma conta?
        
        <a href="/login" className="link">Entrar</a>
        </p>
    </div>
    
    </div>
);
};

export default LandingPage;

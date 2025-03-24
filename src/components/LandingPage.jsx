import React from 'react';
import './LandingPage.css'; // Importa o arquivo de estilo

const LandingPage = () => {
return (
    <div className="landing-container">
      {/* Lado esquerdo com o logo grande */}
    <div className="landing-left">
        <div className="logo-container">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9f/X_logo_2023.svg"
            alt="X Logo"
            className="logo"
        />
        </div>
    </div>

      {/* Lado direito com o conteúdo */}
    <div className="landing-right">
        <h1 className="heading">Acontecendo agora</h1>
        <h2 className="subheading">Inscreva-se hoje</h2>

        <div className="login-buttons">
        <button className="button">Inscrever-se com Google</button>
        <button className="button">Inscrever-se com Apple</button>
        </div>

        <div className="or-container">
        <hr className="hr" />
        <span className="or-text">ou</span>
        <hr className="hr" />
        </div>

        <button className="button create-account-btn">
        Criar conta
        </button>

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

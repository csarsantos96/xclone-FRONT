import React, { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Login.css';

function GoogleLoginButton() {

  useEffect(() => {
    const handleCallbackResponse = async (response) => {
      console.log("Resposta do Google:", response); // DEBUG

      const credential = GoogleAuthProvider.credential(response.credential);
      try {
        const result = await signInWithCredential(auth, credential);
        console.log("Usuário logado:", result.user);
        window.location.href = "/feed";
      } catch (error) {
        console.error("Erro ao autenticar com Firebase:", error);
      }
    };

    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "513392181946-nolko710ic1sboseasduo3pf8ahr75cs.apps.googleusercontent.com",
        callback: handleCallbackResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: 300
        }
      );
    } else {
      console.error("Google API não carregada.");
    }
  }, []);

  return <div id="google-button"></div>;
}

export default GoogleLoginButton;

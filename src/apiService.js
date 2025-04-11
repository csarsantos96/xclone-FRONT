/**
 * The code defines functions to obtain a Firebase token and send a POST request with authorization to
 * a specified API endpoint.
 * @returns The `obterTokenFirebase` function returns a Firebase user token if a user is logged in,
 * otherwise it returns `null`. The `enviarRequisicao` function sends a POST request to the specified
 * API endpoint with a sample content and authorization header containing the user token.
 */
// apiService.js
import axios from 'axios';
import { auth } from './firebaseConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("API Base URL:", API_BASE_URL);


export async function obterTokenFirebase() {
    const user = auth.currentUser;
    if (user) {
    const token = await user.getIdToken();
    return token;
    } else {
    console.log("Nenhum usuário logado.");
    return null;
    }
}

export async function enviarRequisicao() {
const user = auth.currentUser;
if (user) {
    const token = await user.getIdToken();
    console.log("Token:", token);
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/tweets/`,
            { content: "Olá mundo!" },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
    
    console.log("Resposta do backend:", response.data);
    } catch (error) {
    console.error("Erro ao enviar requisição:", error);
    }
} else {
    console.log("Nenhum usuário logado.");
}
}

// apiService.js
import axios from 'axios';
import { auth } from './firebaseConfig';



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
        'http://localhost:8000/api/tweets/',
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

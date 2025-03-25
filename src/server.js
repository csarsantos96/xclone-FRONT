// server.js
const express = require('express');
const admin = require('firebase-admin');
const { Pool } = require('pg');
const serviceAccount = require('./serviceAccountKey.json'); // caminho para o arquivo da chave

// Inicializa o Firebase Admin
admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

// Configura o pool do PostgreSQL
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'x_db',
password: 'sua_senha',
port: 5432,
});

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Rota para criar usuário no banco PostgreSQL após o cadastro
app.post('/api/createUser', async (req, res) => {
const { firebaseUid, email } = req.body;
try {
    const query = 'INSERT INTO users (firebase_uid, email) VALUES ($1, $2)';
    await pool.query(query, [firebaseUid, email]);
    res.status(200).json({ message: 'Usuário salvo no PostgreSQL!' });
} catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ error: 'Erro ao salvar usuário no banco' });
}
});

// Rota para validar token Firebase e retornar dados do usuário
app.get('/api/protected', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  try {
    // Verifica o token com o Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

require('dotenv').config(); 

const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const authMiddleware = require('./authMiddleware');

const app = express();
const porta = process.env.PORT || 8080;

app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Aplicar o middleware de autenticação antes das rotas
app.use(authMiddleware);

// Usar as rotas importadas
app.use(routes);

// Middleware para capturar rotas não encontradas
app.use((req, res, next) => {
    res.status(404).send({
        "message": "Rota não encontrada, olhe a documentação para ver as rotas disponíveis",
        "data": []
    });
});

app.listen(porta, () => {
    console.log(`API está sendo executada na porta ${porta}!`);
});
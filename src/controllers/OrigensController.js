const fs = require('fs');
const path = require('path');
const util = require('../util');
const filePath = path.join(__dirname, '../jsons/origens.json');

// Função para ler dados do arquivo JSON
const readJsonFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Função para escrever dados no arquivo JSON
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
    getOrigens(req, res) {
        const origens = readJsonFile(filePath);
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": origens
        }
        return res.json(resposta);
    },
    getOrigensByName(req, res) {
        const origens = readJsonFile(filePath);
        const origem = util.getDataByKey(origens, req, 'origem');
        const mensagem = origem.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma origem encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "data": origens[origem] ? origens[origem] : []
        }
        return res.json(resposta);
    },
    createOrigem(req, res) {
        const origens = readJsonFile(filePath);
        const { nome, descricao, beneficios } = req.body;

        if (!nome || !descricao || !beneficios) {
            return res.status(400).json({ message: "Nome, descrição e benefícios são obrigatórios" });
        }

        const id = Object.keys(origens).length + 1;
        const novaOrigem = {
            id,
            nome,
            descricao,
            beneficios
        };

        origens[nome.toLowerCase()] = novaOrigem;

        writeJsonFile(filePath, origens);
        res.status(201).json({ message: 'Origem criada com sucesso!', data: novaOrigem });
    },
    updateOrigem(req, res) {
        const origens = readJsonFile(filePath);
        const { nome, descricao, beneficios } = req.body;
        const key = req.params.origem.toLowerCase();

        if (!origens[key]) {
            return res.status(404).json({ message: "Origem não encontrada" });
        }

        const updatedNome = nome ? nome : origens[key].nome;
        const updatedDescricao = descricao ? descricao : origens[key].descricao;
        const updatedBeneficios = beneficios ? beneficios : origens[key].beneficios;

        origens[key] = {
            id: origens[key].id,
            nome: updatedNome,
            descricao: updatedDescricao,
            beneficios: updatedBeneficios
        };

        writeJsonFile(filePath, origens);
        res.status(200).json({ message: 'Origem atualizada com sucesso!', data: origens[key] });
    },
    deleteOrigem(req, res) {
        try {
            const origens = readJsonFile(filePath);
            const key = req.params.origem.toLowerCase();

            if (!origens[key]) {
                return res.status(404).json({ message: "Origem não encontrada" });
            }

            delete origens[key];
            writeJsonFile(filePath, origens);
            res.status(200).json({ message: 'Origem deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar origem', error: error.message });
        }
    }
};

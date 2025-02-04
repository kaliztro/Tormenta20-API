const fs = require('fs');
const path = require('path');
const util = require('../util');
const filePath = path.join(__dirname, '../jsons', 'pericias.json');

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
    getPericias(req, res) {
        const pericias = readJsonFile(filePath);
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": pericias
        }
        return res.json(resposta);
    },
    getPericiasByName(req, res) {
        const pericias = readJsonFile(filePath);
        const pericia = util.getDataByKey(pericias, req, 'pericia');
        const mensagem = pericia.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma perícia encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "data": pericias[pericia] ? pericias[pericia] : []
        }
        return res.json(resposta);
    },
    createPericia(req, res) {
        const pericias = readJsonFile(filePath);
        const { nome, treinada, atributo, penalidade_armadura, descricao, caracteristicas } = req.body;

        if (!nome || !treinada || !atributo || !penalidade_armadura || !descricao || !caracteristicas) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const id = Object.keys(pericias).length + 1;
        const novaPericia = {
            id,
            nome,
            treinada,
            atributo,
            penalidade_armadura,
            descricao,
            caracteristicas
        };

        pericias[nome.toLowerCase()] = novaPericia;

        writeJsonFile(filePath, pericias);
        res.status(201).json({ message: 'Perícia criada com sucesso!', data: novaPericia });
    },

    updatePericia(req, res) {
        try {
            const pericias = readJsonFile(filePath);
            const key = req.params.pericia.toLowerCase();

            if (!pericias[key]) {
                return res.status(404).json({ message: "Perícia não encontrada" });
            }

            // Atualiza apenas os campos fornecidos na requisição
            const updatedPericia = { ...pericias[key], ...req.body }; // Mantém os valores antigos e atualiza os novos fornecidos

            // Atualiza os dados da perícia
            pericias[key] = updatedPericia;

            writeJsonFile(filePath, pericias);
            res.status(200).json({ message: 'Perícia atualizada com sucesso!', data: updatedPericia });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar perícia', error: error.message });
        }
    },

    deletePericia(req, res) {
        try {
            const pericias = readJsonFile(filePath);
            const key = req.params.pericia.toLowerCase();

            if (!pericias[key]) {
                return res.status(404).json({ message: "Perícia não encontrada" });
            }

            delete pericias[key];
            writeJsonFile(filePath, pericias);
            res.status(200).json({ message: 'Perícia deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar perícia', error: error.message });
        }
    }
};

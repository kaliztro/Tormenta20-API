const fs = require('fs');
const path = require('path');
const util = require('../util');
const filePath = path.join(__dirname, '../jsons', 'racas.json');

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
    getRacas(req, res) {
        const racas = readJsonFile(filePath);
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": racas
        }
        return res.json(resposta);
    },
    getRacasByName(req, res) {
        const racas = readJsonFile(filePath);
        const raca = util.getDataByKey(racas, req, 'raca');
        const mensagem = raca.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma raça encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "data": racas[raca] ? racas[raca] : []
        }
        return res.json(resposta);
    },
    createRaca(req, res) {
        const racas = readJsonFile(filePath);
        const { nome, bonus, habilidades_de_raca } = req.body;

        if (!nome || !bonus || !habilidades_de_raca) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const id = Object.keys(racas).length + 1;
        const novaRaca = {
            id,
            nome,
            bonus,
            habilidades_de_raca
        };

        racas[nome.toLowerCase()] = novaRaca;

        writeJsonFile(filePath, racas);
        res.status(201).json({ message: 'Raça criada com sucesso!', data: novaRaca });
    },

    updateRaca(req, res) {
        try {
            const racas = readJsonFile(filePath);
            const key = req.params.raca.toLowerCase();
    
            if (!racas[key]) {
                return res.status(404).json({ message: "Raça não encontrada" });
            }
    
            Object.assign(racas[key], req.body);

            writeJsonFile(filePath, racas);
            res.status(200).json({ message: 'Raça atualizada com sucesso!', data: racas[key] });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar raça', error: error.message });
        }
    },
    
    deleteRaca(req, res) {
        try {
            const racas = readJsonFile(filePath);
            const key = req.params.raca.toLowerCase();

            if (!racas[key]) {
                return res.status(404).json({ message: "Raça não encontrada" });
            }

            delete racas[key];
            writeJsonFile(filePath, racas);
            res.status(200).json({ message: 'Raça deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar raça', error: error.message });
        }
    }
};

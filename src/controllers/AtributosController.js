const fs = require('fs');
const path = require('path');
const util = require('../util');

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, '../jsons', 'atributos.json');

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
    getatributos(req, res) {
        const atributos = readJsonFile(filePath);
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": atributos
        }
        return res.json(resposta);
    },
    getatributosByName(req, res) {
        const atributos = readJsonFile(filePath);
        const atributo = util.getDataByKey(atributos, req, 'atributo');
        const mensagem = atributo.length > 0 ? "Informações obtidas com sucesso!" : "Nenhum atributo encontrado com este nome!";
        const resposta = {
            "message": mensagem,
            "data": atributos[atributo] ? atributos[atributo] : []
        }
        return res.json(resposta);
    },
    createAtributo(req, res) {
        try {
            const data = readJsonFile(filePath);
            const { id, nome, descricao } = req.body;

            if (!nome || !descricao) {
                return res.status(400).json({ message: "O nome e a descrição do atributo são obrigatórios" });
            }

            if (data[nome]) {
                return res.status(400).json({ message: "Atributo já existe" });
            }

            const novoAtributo = {
                id: Object.keys(data).length + 1,
                nome: nome.toUpperCase(),
                descricao
            };

            data[nome.toLowerCase()] = novoAtributo;
            writeJsonFile(filePath, data);
            res.status(201).json({ message: 'Atributo criado com sucesso!', data: novoAtributo });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar atributo', error: error.message });
        }
    },
    updateAtributo(req, res) {
        try {
            const data = readJsonFile(filePath);
            const { nome, descricao } = req.body;
            const key = req.params.atributo.toLowerCase();

            if (!data[key]) {
                return res.status(404).json({ message: "Atributo não encontrado" });
            }

            // Manter o nome existente se não for fornecido no corpo da requisição
            const updatedNome = nome ? nome.toUpperCase() : data[key].nome;
            const updatedDescricao = descricao || data[key].descricao;

            data[key] = {
                id: data[key].id,
                nome: updatedNome,
                descricao: updatedDescricao
            };

            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Atributo editado com sucesso!', data: data[key] });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao editar atributo', error: error.message });
        }
    },
    deleteAtributo(req, res) {
        try {
            const data = readJsonFile(filePath);
            const key = req.params.atributo.toLowerCase();

            if (!data[key]) {
                return res.status(404).json({ message: "Atributo não encontrado" });
            }

            delete data[key];
            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Atributo deletado com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar atributo', error: error.message });
        }
    }
};

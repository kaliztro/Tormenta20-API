const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, '../jsons', 'divindades.json');

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
    getDivindades(req, res) {
        const divindades = readJsonFile(filePath);
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": divindades
        }
        return res.json(resposta);
    },

    getDivindadesByName(req, res) {
        const divindades = readJsonFile(filePath);
        const divindade = divindades[req.params.divindade];
        const mensagem = divindade ? "Informações obtidas com sucesso!" : "Nenhuma divindade encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "data": divindade ? divindade : []
        }
        return res.json(resposta);
    },

    createDivindade(req, res) {
        try {
            const data = readJsonFile(filePath);
            const { id, nome, crencas_objetivos, devotos_permitidos, simbolo_sagrado, canalizar_energia, arma_preferida, obrigacoes_restricoes, poderes_concedidos } = req.body;

            if (!nome || !crencas_objetivos || !devotos_permitidos || !simbolo_sagrado || !canalizar_energia || !arma_preferida || !obrigacoes_restricoes || !poderes_concedidos) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }

            const key = nome.toLowerCase().replace(/\s/g, '_');
            if (data[key]) {
                return res.status(400).json({ message: "Divindade já existe" });
            }

            const novaDivindade = {
                id: Object.keys(data).length + 1,
                nome,
                crencas_objetivos,
                devotos_permitidos,
                simbolo_sagrado,
                canalizar_energia,
                arma_preferida,
                obrigacoes_restricoes,
                poderes_concedidos
            };

            data[key] = novaDivindade;
            writeJsonFile(filePath, data);
            res.status(201).json({ message: 'Divindade criada com sucesso!', data: novaDivindade });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar divindade', error: error.message });
        }
    },

    updateDivindade(req, res) {
        try {
            const data = readJsonFile(filePath);
            const key = req.params.divindade.toLowerCase().replace(/\s/g, '_');

            if (!data[key]) {
                return res.status(404).json({ message: "Divindade não encontrada" });
            }

            Object.assign(data[key], req.body);

            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Divindade editada com sucesso!', data: data[key] });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao editar divindade', error: error.message });
        }
    },

    deleteDivindade(req, res) {
        try {
            const data = readJsonFile(filePath);
            const key = req.params.divindade.toLowerCase();

            if (!data[key]) {
                return res.status(404).json({ message: "Divindade não encontrado" });
            }

            delete data[key];
            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Divindade deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar divindade', error: error.message });
        }
    }
};

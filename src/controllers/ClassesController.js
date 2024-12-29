const fs = require('fs');
const path = require('path');
const classes = require('../jsons/classes.json');
const util = require('../util');
const filePath = path.join(__dirname, '../jsons', 'classes.json');

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
    getClasses(req, res) {
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": classes
        }
        return res.json(resposta);
    },
    getClassesByName(req, res) {
        const classe = util.getDataByKey(classes, req, 'classe');
        const mensagem = classe.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma classe encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "data": classes[classe] ? classes[classe] : []
        }
        return res.json(resposta);
    },
    getHabilidadesClasse(req, res) {
        const classe = util.getDataByKey(classes, req, 'classe');
        const mensagem = classe.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma classe encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "classe": classe[0],
            "data": classes[classe] ? classes[classe].habilidades : []
        }
        return res.json(resposta);
    },
    getTabelaNivel(req, res) {
        const classe = util.getDataByKey(classes, req, 'classe');
        const mensagem = classe.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma classe encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "classe": classe[0],
            "data": classes[classe] ? classes[classe].tabela : []
        }
        return res.json(resposta);
    },
    getProeficienciasClasse(req, res) {
        const classe = util.getDataByKey(classes, req, 'classe');
        const mensagem = classe.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma classe encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "classe": classe[0],
            "data": classes[classe].proeficiencias != null ? classes[classe].proeficiencias : []
        }
        return res.json(resposta);
    },
    getPericiasClasse(req, res) {
        const classe = util.getDataByKey(classes, req, 'classe');
        const mensagem = classe.length > 0 ? "Informações obtidas com sucesso!" : "Nenhuma classe encontrada com este nome!";
        const resposta = {
            "message": mensagem,
            "classe": classe[0],
            "data": classes[classe].pericias != null ? classes[classe].pericias : []
        }
        return res.json(resposta);
    },
    createClasse(req, res) {
        const data = readJsonFile(filePath);
        const { nome, pv, pm, pericias, proeficiencias, habilidades, tabela } = req.body;

        if (!nome || !pv || !pm || !pericias || !proeficiencias || !habilidades || !tabela) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const id = Object.keys(data).length + 1;
        const novaClasse = {
            id,
            nome,
            pv,
            pm,
            pericias,
            proeficiencias,
            habilidades,
            tabela
        };

        data[nome.toLowerCase()] = novaClasse;

        writeJsonFile(filePath, data);
        res.status(201).json({ message: 'Classe criada com sucesso!', data: novaClasse });
    },
    updateClasse(req, res) {
        const data = readJsonFile(filePath);
        const { nome, pv, pm, pericias, proeficiencias, habilidades, tabela } = req.body;
        const key = req.params.classe.toLowerCase();

        if (!data[key]) {
            return res.status(404).json({ message: "Classe não encontrada" });
        }

        const updatedNome = nome ? nome : data[key].nome;
        const updatedPv = pv ? pv : data[key].pv;
        const updatedPm = pm ? pm : data[key].pm;
        const updatedPericias = pericias ? pericias : data[key].pericias;
        const updatedProeficiencias = proeficiencias ? proeficiencias : data[key].proeficiencias;
        const updatedHabilidades = habilidades ? habilidades : data[key].habilidades;
        const updatedTabela = tabela ? tabela : data[key].tabela;

        data[key] = {
            id: data[key].id,
            nome: updatedNome,
            pv: updatedPv,
            pm: updatedPm,
            pericias: updatedPericias,
            proeficiencias: updatedProeficiencias,
            habilidades: updatedHabilidades,
            tabela: updatedTabela
        };

        writeJsonFile(filePath, data);
        res.status(200).json({ message: 'Classe atualizada com sucesso!', data: data[key] });
    },
    deleteClasse(req, res) {
        try {
            const data = readJsonFile(filePath);
            const key = req.params.classe.toLowerCase();

            if (!data[key]) {
                return res.status(404).json({ message: "Classe não encontrada" });
            }

            delete data[key];
            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Classe deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar classe', error: error.message });
        }
    }
};

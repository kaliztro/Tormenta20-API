const fs = require('fs');
const path = require('path');
const util = require('../util');

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, '../jsons', 'poderes.json');

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
    getPoderes(req, res) {
        const poderes = readJsonFile(filePath);
        const mensagem = "Informações obtidas com sucesso!";
        const resposta = {
            "message": mensagem,
            "data": poderes
        };
        return res.json(resposta);
    },

    getPoderesByName(req, res) {
        const poderes = readJsonFile(filePath);
        const poderNome = util.getDataByKey(poderes, req, 'poder');
        const mensagem = poderNome.length > 0 ? "Informações obtidas com sucesso!" : "Nenhum poder encontrado com este nome!";
        const resposta = {
            "message": mensagem,
            "data": poderes[poderNome] ? poderes[poderNome] : []
        };
        return res.json(resposta);
    },

    getPoderesByGrupo(req, res) {
        const poderes = readJsonFile(filePath);
        const poderesDoGrupo = util.getDataByClasse(poderes, req);
        const mensagem = poderesDoGrupo.length > 0 ? "Poderes do grupo encontrados com sucesso!" : "Nenhum poder encontrado para este grupo!";
        const resposta = {
            "message": mensagem,
            "data": poderesDoGrupo.map(([key, value]) => value) // Mapeia para retornar apenas os valores
        };
        return res.json(resposta);
    },

    createPoder(req, res) {
        try {
            const data = readJsonFile(filePath);
            const { id, nome, descricao, grupo, pre_requisito, fonte, ...novosCampos } = req.body;
            
            // Verificando se todos os campos obrigatórios foram fornecidos
            if (!nome || !descricao || !grupo || !pre_requisito || fonte === undefined) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios" });
            }
        
            // Criando a chave no formato correto (minúscula e com _ ao invés de espaços)
            const chavePoder = nome.toLowerCase().replace(/\s/g, '_');
        
            // Verifica se o poder já existe
            if (data[chavePoder]) {
                return res.status(400).json({ message: "Poder já existe" });
            }
        
            // Criação do novo poder com os campos obrigatórios
            const novoPoder = {
                id: Object.keys(data).length + 1,  // Atribui um ID único baseado na quantidade de poderes já existentes
                nome,
                descricao,
                grupo,
                pre_requisito,
                fonte,
                ...novosCampos  // Adiciona os novos campos passados na requisição
            };
            
            // Adiciona o novo poder ao objeto de poderes
            data[chavePoder] = novoPoder;
        
            // Escreve os dados modificados no arquivo
            writeJsonFile(filePath, data);
        
            res.status(201).json({ message: 'Poder criado com sucesso!', data: novoPoder });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar poder', error: error.message });
        }
    },

    updatePoder(req, res) {
        try {
            const data = readJsonFile(filePath);
            const { nome, descricao, grupo, pre_requisito, fonte, ...novosCampos } = req.body;
            const key = req.params.poder.toLowerCase();

            if (!data[key]) {
                return res.status(404).json({ message: "Poder não encontrado" });
            }

            // Manter o nome existente se não for fornecido no corpo da requisição
            const updatedNome = nome ? nome.toUpperCase() : data[key].nome;
            const updatedDescricao = descricao || data[key].descricao;
            const updatedGrupo = grupo || data[key].grupo;
            const updatedPreRequisito = pre_requisito || data[key].pre_requisito;
            const updatedFonte = fonte !== undefined ? fonte : data[key].fonte;

            data[key] = {
                id: data[key].id,
                nome: updatedNome,
                descricao: updatedDescricao,
                grupo: updatedGrupo,
                pre_requisito: updatedPreRequisito,
                fonte: updatedFonte,
                ...novosCampos  // Adicionando qualquer novo campo passado no corpo da requisição
            };

            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Poder atualizado com sucesso!', data: data[key] });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar poder', error: error.message });
        }
    },

    deletePoder(req, res) {
        try {
            const data = readJsonFile(filePath);
            const key = req.params.poder.toLowerCase();

            if (!data[key]) {
                return res.status(404).json({ message: "Poder não encontrado" });
            }

            delete data[key];
            writeJsonFile(filePath, data);
            res.status(200).json({ message: 'Poder deletado com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar poder', error: error.message });
        }
    }
};

const fs = require('fs');
const path = require('path');
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
        const poderNome = req.params.poder;  // Aqui estamos acessando 'poder', que é o parâmetro na URL

        console.log('Nome do poder recebido:', poderNome);

        if (!poderNome || poderNome.trim() === '') {
            return res.status(400).json({ message: "Nome do poder não fornecido ou inválido." });
        }

        const poder = poderes[poderNome];

        if (!poder) {
            return res.status(404).json({ message: "Poder não encontrado" });
        }

        res.status(200).json({
            message: "Informações obtidas com sucesso!",
            data: poder
        });
    },

    createPoder(req, res) {
        const poderes = readJsonFile(filePath);
        const { nome, descricao, grupo, pre_requisito, fonte } = req.body;

        if (!nome || !descricao || !grupo || !pre_requisito || fonte === undefined) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        // Se o poder já existir, retorna erro
        if (poderes[nome]) {
            return res.status(400).json({ message: "Poder já existe" });
        }

        const novoPoder = {
            nome,
            descricao,
            grupo,
            pre_requisito,
            fonte
        };

        // Adiciona o novo poder ao objeto de poderes
        poderes[nome] = novoPoder;

        // Escreve os dados modificados no arquivo
        writeJsonFile(filePath, poderes);

        res.status(201).json({ message: 'Poder criado com sucesso!', data: novoPoder });
    },

    updatePoder(req, res) {
        const poderes = readJsonFile(filePath);
        const poderNome = req.params.poder; // Acessando o parâmetro corretamente
    
        // Verifique se o nome do poder está correto
        console.log('Nome do poder recebido:', poderNome);
    
        // Verifique se o poder existe no arquivo
        const poderExistente = poderes[poderNome];
    
        if (!poderExistente) {
            console.log(`Poder não encontrado: ${poderNome}`);
            return res.status(404).json({ message: "Poder não encontrado" });
        }
    
        // Desestruturando o corpo da requisição
        const { descricao, grupo, pre_requisito, fonte, ...novosCampos } = req.body;
    
        // Mantendo o ID existente e atualizando os campos fornecidos
        const updatedPoder = {
            id: poderExistente.id,  // Preservando o ID do poder
            nome: poderNome,
            descricao: descricao || poderExistente.descricao,
            grupo: grupo || poderExistente.grupo,
            pre_requisito: pre_requisito || poderExistente.pre_requisito,
            fonte: fonte !== undefined ? fonte : poderExistente.fonte,
            ...novosCampos  // Adicionando qualquer novo campo passado no corpo da requisição
        };
    
        // Substitui o poder existente
        poderes[poderNome] = updatedPoder;
    
        // Escreve os dados modificados no arquivo
        writeJsonFile(filePath, poderes);
    
        res.status(200).json({ message: 'Poder atualizado com sucesso!', data: updatedPoder });
    },
    
    deletePoder(req, res) {
        const poderes = readJsonFile(filePath);
        const poderNome = req.params.poder; // Acessando o parâmetro corretamente

        // Verifique se o nome do poder está correto
        console.log('Nome do poder a ser deletado:', poderNome);

        // Verifique se o poder existe no arquivo
        const poderExistente = poderes[poderNome];

        if (!poderExistente) {
            console.log(`Poder não encontrado: ${poderNome}`);
            return res.status(404).json({ message: "Poder não encontrado" });
        }

        // Exclua o poder do objeto
        delete poderes[poderNome];

        // Escreva os dados modificados no arquivo
        writeJsonFile(filePath, poderes);

        res.status(200).json({ message: 'Poder deletado com sucesso!' });
    }

};

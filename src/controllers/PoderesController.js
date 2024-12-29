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

    getPoderesByGrupo(req, res) {
        const poderes = readJsonFile(filePath);
        const grupo = req.params.grupo.toLowerCase().replace(/\s/g, '_');  // Normaliza o nome do grupo

        if (!grupo || grupo.trim() === '') {
            return res.status(400).json({ message: "Nome do grupo não fornecido ou inválido." });
        }

        // Filtra os poderes que pertencem ao grupo fornecido
        const poderesDoGrupo = Object.values(poderes).filter(poder => poder.grupo.toLowerCase().replace(/\s/g, '_') === grupo);

        if (poderesDoGrupo.length === 0) {
            return res.status(404).json({ message: `Nenhum poder encontrado para o grupo "${grupo}"` });
        }

        res.status(200).json({
            message: `Poderes do grupo "${grupo}" encontrados com sucesso!`,
            data: poderesDoGrupo
        });
    },

    createPoder(req, res) {
        const poderes = readJsonFile(filePath);
        const { nome, descricao, grupo, pre_requisito, fonte, ...novosCampos } = req.body;
        
        // Verificando se todos os campos obrigatórios foram fornecidos
        if (!nome || !descricao || !grupo || !pre_requisito || fonte === undefined) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }
    
        // Criando a chave no formato correto (minúscula e com _ ao invés de espaços)
        const chavePoder = nome.toLowerCase().replace(/\s/g, '_');
    
        // Verifica se o poder já existe
        if (poderes[chavePoder]) {
            return res.status(400).json({ message: "Poder já existe" });
        }
    
        // Criação do novo poder com os campos obrigatórios
        const novoPoder = {
            id: Object.keys(poderes).length + 1,  // Atribui um ID único baseado na quantidade de poderes já existentes
            nome,
            descricao,
            grupo,
            pre_requisito,
            fonte,
            ...novosCampos  // Adiciona os novos campos passados na requisição
        };
        
        // Adiciona o novo poder ao objeto de poderes
        poderes[chavePoder] = novoPoder;
    
        // Escreve os dados modificados no arquivo
        writeJsonFile(filePath, poderes);
    
        res.status(201).json({ message: 'Poder criado com sucesso!', data: novoPoder });
    },

    updatePoder(req, res) {
        const poderes = readJsonFile(filePath);
        const poderNome = req.params.poder; // Acessando o parâmetro corretamente
        
        // Verifique se o poder existe no arquivo
        const poderExistente = poderes[poderNome];
    
        if (!poderExistente) {
            return res.status(404).json({ message: "Poder não encontrado" });
        }
    
        // Desestruturando o corpo da requisição
        const { descricao, grupo, pre_requisito, fonte, ...novosCampos } = req.body;
    
        // Preservando o ID existente e atualizando os campos fornecidos
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

        // Verifique se o poder existe no arquivo
        const poderExistente = poderes[poderNome];

        if (!poderExistente) {
            return res.status(404).json({ message: "Poder não encontrado" });
        }

        // Exclua o poder do objeto
        delete poderes[poderNome];

        // Escreva os dados modificados no arquivo
        writeJsonFile(filePath, poderes);

        res.status(200).json({ message: 'Poder deletado com sucesso!' });
    }

};

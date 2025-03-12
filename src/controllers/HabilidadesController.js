const fs = require('fs');

// Caminho para o arquivo JSON
const classes = require("../../src/jsons/classes.json");

// Função para ler dados do arquivo JSON
const readJsonFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Função para escrever dados no arquivo JSON
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

/**
 * Função recursiva para buscar dentro de um objeto qualquer.
 * Retorna os objetos que contenham a propriedade "nome" compatível com a query.
 */
function searchNestedHabilidade(obj, query) {
    let matches = [];
    if (obj && typeof obj === 'object') {
        if (obj.nome && typeof obj.nome === 'string' && obj.nome.toLowerCase().includes(query.toLowerCase())) {
            matches.push(obj);
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                matches = matches.concat(searchNestedHabilidade(obj[key], query));
            }
        }
    }
    return matches;
}

/**
 * Função recursiva para coletar os nomes das habilidades de um objeto,
 * adicionando-os a um Set para garantir a unicidade.
 * Habilidades cujo nome for exatamente "Aprimorada" (ignorando maiúsculas e espaços)
 * serão ignoradas.
 */
function collectAbilityNamesToSet(obj, namesSet) {
    if (obj && typeof obj === 'object') {
        if (obj.nome && typeof obj.nome === 'string') {
            const nomeLimpo = obj.nome.trim();
            if (nomeLimpo.toLowerCase() !== '•aprimorada') {
                namesSet.add(obj.nome);
            }
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                collectAbilityNamesToSet(obj[key], namesSet);
            }
        }
    }
}

module.exports = {
    /**
     * getHabilidades:
     * Retorna um array de objetos com o nome da habilidade e as classes onde ela aparece.
     * Se uma mesma habilidade ocorrer em várias classes, ela será agrupada.
     */
    getHabilidades(req, res) {
        const abilitiesMap = {};

        // Percorre cada classe e coleta os nomes das habilidades presentes nela.
        for (const classeKey in classes) {
            if (classes.hasOwnProperty(classeKey)) {
                const classe = classes[classeKey];
                if (classe.habilidades) {
                    const classAbilities = new Set();
                    // Coleta recursivamente os nomes de habilidades (incluindo as aninhadas)
                    for (const key in classe.habilidades) {
                        if (classe.habilidades.hasOwnProperty(key)) {
                            collectAbilityNamesToSet(classe.habilidades[key], classAbilities);
                        }
                    }
                    // Agrupa as habilidades encontradas para essa classe
                    classAbilities.forEach(abilityName => {
                        const keyNormalized = abilityName.toLowerCase().trim();
                        if (!abilitiesMap[keyNormalized]) {
                            abilitiesMap[keyNormalized] = { nome: abilityName, classes: [classe.nome] };
                        } else {
                            if (!abilitiesMap[keyNormalized].classes.includes(classe.nome)) {
                                abilitiesMap[keyNormalized].classes.push(classe.nome);
                            }
                        }
                    });
                }
            }
        }

        // Transforma o mapa em array e ordena pelo nome da habilidade
        const abilityList = Object.values(abilitiesMap).sort((a, b) => a.nome.localeCompare(b.nome));
        const resposta = {
            message: "Habilidades obtidas com sucesso!",
            data: abilityList
        };

        return res.json(resposta);
    },

    getHabilidadesByName(req, res) {
        const { habilidade } = req.params;
        const habilidadesEncontradas = [];

        // Percorre todas as classes para buscar a habilidade desejada
        for (const classeKey in classes) {
            if (classes.hasOwnProperty(classeKey)) {
                const classe = classes[classeKey];
                if (classe.habilidades) {
                    for (const key in classe.habilidades) {
                        if (classe.habilidades.hasOwnProperty(key)) {
                            const topHabilidade = classe.habilidades[key];
                            const matches = searchNestedHabilidade(topHabilidade, habilidade);
                            if (matches.length > 0) {
                                matches.forEach(match => {
                                    habilidadesEncontradas.push({
                                        classe: classe.nome,
                                        // Indica a habilidade pai (top-level) em que o match foi encontrado
                                        habilidadePai: topHabilidade.nome,
                                        nome: match.nome,
                                        descricao: match.descricao
                                    });
                                });
                            }
                        }
                    }
                }
            }
        }

        if (habilidadesEncontradas.length > 0) {
            res.json(habilidadesEncontradas);
        } else {
            res.status(404).json({ message: "Habilidade não encontrada." });
        }
    }
};

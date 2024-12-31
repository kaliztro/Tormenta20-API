module.exports = {
    getDataById(data, req) {
        return Object.keys(data).filter(key => data[key].id === req.params.id);
    },
    getDataByKey(data, req, option) {
        const normalizedOption = req.params[option]
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, '_');
            console.log(normalizedOption)
        return Object.keys(data).filter(key => key === normalizedOption);
    },    
    getDataByClasse(data, req) {
        const normalizedClasse = req.params.classe
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, '_');
            console.log(normalizedClasse)
        return Object.entries(data).filter(([key, value]) => value.classe
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, '_') === normalizedClasse);
    },
    getDataByTipo(data, req) {
        const normalizedTipo = req.params.tipo
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, '_');
            console.log(normalizedTipo)
        return Object.entries(data).filter(([key, value]) => value.tipo
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, '_') === normalizedTipo);
            
    },
}


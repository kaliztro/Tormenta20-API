const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        }

        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    } else {
        next();
    }
};

module.exports = authMiddleware;
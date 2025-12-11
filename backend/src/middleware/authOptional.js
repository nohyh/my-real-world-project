const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authOptional = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        req.user = user;
    } catch (err) {
        // Token 无效也不报错，只是当做游客处理
        req.user = null;
    }
    next();
};

module.exports = authOptional;

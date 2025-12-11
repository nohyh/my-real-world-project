const {verifyToken}=require('../utils/jwt');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient(); 

const authMiddleware=async (req,res,next)=>{
    const authHeader =req.headers.authorization;
    if(!authHeader){
        req.user =null;
        return next();
    }
    const token =authHeader.split(' ')[1]
    try{
        const decoded =verifyToken(token);
        const user =await prisma.user.findUnique({where:{id:decoded.userId}})
        if(!user){
            req.user =null;
        }
        else{
            req.user =user;
        }
        next();
    }
    catch(error){
        req.user =null;
        next();
    }
};
module.exports = authMiddleware;

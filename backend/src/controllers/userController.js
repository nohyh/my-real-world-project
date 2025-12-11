const { PrismaClient } = require('@prisma/client');
const prisma =new PrismaClient();
const bcrypt =require('bcryptjs')
const { signToken } = require('../utils/jwt'); 
const register =async(req,res)=>{
    try{
        const {username,email,password} =req.body.user;
        if(!username || !email || !password){
            return res.status(400).json({errors:{body:['ALL fields are required']}});
        }
        const existingUser =await prisma.user.findFirst({
            where:{
                OR:[{email},{username}],
            },
        });
        if(existingUser){
            return res.status(422).json({
                errors:{body:['User already exists']}
            });
        }
        const hashedPassword =await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword,
            },
        })
        const token =signToken(user.id)
        res.status(201).json({
            user:{
                email:user.email,
                token:token,
                username:user.username,
                bio:user.bio,
                image:user.image,
            },
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({errors:{body:['Server error']}});
    }
}
const login =async(req,res)=>{
    try{
        const{email,password} =req.body.body;
        if(!email||!password){
            return res.status(400).json({error:{body:['Email or password is required']}})
        }
        const user =await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(401).json({error:{body:['Invalid email']}})
        }
        const isValidPassword =await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(401).json({error:{body:['Invalid password']}})
        }
        const token =signToken(user.id);
        res.status(200).json({
            user:{
                email:user.email,
                token:token,
                username:user.username,
                bio:user.bio,
                image:user.image,
            }
        })

    }
    catch(error){
        res.status(500).json({errors:{body:['Server error']}});
    }
    }
    const getCurrentUser =async(req,res)=>{
        const user =req.user;
        if(!user){
            return res.status(401).json({errors:{body:['Unauthorized']}});
        }
        res.json({
            user:{
                email:user.email,
                token:signToken(user.id),
                username:user.username,
                bio:user.bio,
                image:user.image,
            }
        })
    }
    const updateUser = async(req,res)=>{
        const {email,username,password,image,bio} =req.body.user;
        const user =req.user;
        if(!user){
            return res.status(401).json({errors:{body:['Unauthorized']}});
        }
        const dataToUpdate={};
        if(email){
            dataToUpdate.email=email;
        }
        if(username){
            dataToUpdate.username=username;
        }
        if(password){
            dataToUpdate.password =await bcrypt.hash(password,10);
        }
        if(image){
            dataToUpdate.image=image;
        }
        if(bio){
            dataToUpdate.bio=bio;
        }
        try{
            const updatedUser =await prisma.user.update({
                where:{ id:user.id},
                data:dataToUpdate,
            })
            res.json({
                user:{
                    email:updatedUser.email,
                    token:signToken(updatedUser.id),
                    username:updatedUser.username,
                    bio:updatedUser.bio,
                    image:updatedUser.image,
                }
            });
        }
        catch(error){
            res.status(422).json({errors:{body:['Update failed']} });
        }
    }
module.exports ={register,login,getCurrentUser,updateUser};
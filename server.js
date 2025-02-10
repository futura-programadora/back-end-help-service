import express from 'express'
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import axios from 'axios'; 

const prisma = new PrismaClient()

const app = express()
app.use(express.json());
app.use(cors());


//rotas

app.post('/usuarios', async (req, res) => {
    try {
        // Corrigindo o nome do campo de 'amail' para 'email'
        const user = await prisma.user.create({
            data: {
                email: req.body.email,  // Usando 'email' corretamente
                password: req.body.password
            }
        });

        res.status(201).json(user);  // Retorna os dados do novo usuário criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});


app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany();  // Recupera todos os usuários do banco
        res.status(200).json(users);  // Retorna os usuários
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});



const PORT = process.env.PORT || 3001; app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
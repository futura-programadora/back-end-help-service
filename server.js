import express from 'express'
import { PrismaClient } from '@prisma/client';

const app = express()
const prisma = new PrismaClient()
app.use(express.json());

//rotas

app.post('/usuarios', async (req, res) => {
    await prisma.user.create({
        data: {
            email: req.body.amail,
            password: req.body.password
        }
    })

    res.status(201).json(req.body)
});

app.get('/pegar-usuarios', async (req, res) => {
    await prisma.user.findMany();

    res.status(201).json(req.body)
});


const PORT = process.env.PORT || 3001; app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
import express from 'express'
import { PrismaClient } from '@prisma/client';

const app = express()
const prisma = new PrismaClient()
app.use(express.json());

//rotas

export default function handler(req, res) {
    res.status(200).json({ message: 'Olá, Vercel!' });
}


const PORT = process.env.PORT || 3001; app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});